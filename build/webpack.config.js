const path = require('path');
const webpack = require('webpack');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const OfflinePlugin = require('offline-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const sassyImport = require('postcss-sassy-import');
const HappyPack = require('happypack');
const config = require('build/config');
const merge = require('lodash.merge');
const objectAssign = require('object-assign');
const log = require('log')('app:webpack:config');

const paths = config.utils_paths;

const happyThreadPool = HappyPack.ThreadPool({ size: 8 });

log('Creating configuration.');
const webpackConfig = {
  name    : 'client',
  target  : 'web',
  devtool : config.compiler_devtool,
  resolve : {
    modules: [
      paths.base(),
      paths.base('node_modules'),
      paths.client(),
    ],
    alias: objectAssign({},
      require('fbjs-scripts/third-party-module-map'),
      require('fbjs/module-map'),
      config.compiler_babel_options_module_map,
    ),
    extensions : ['.js', '.json'],
  },
  module : {},
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = [paths.client('app.js')];

webpackConfig.entry = {
  polyfills: ['babel-polyfill'],
  app : __DEV__
  ? APP_ENTRY.concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
  : APP_ENTRY,
  vendor : config.compiler_vendors,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename   : __DEV__ ? '[name].js' : `[name].[${config.compiler_hash_type}].js`,
  path       : paths.dist(),
  publicPath : config.compiler_public_path,
  pathinfo   : __DEV__,
};

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {};

// ------------------------------------
// Plugins
// ------------------------------------

const STYLE_LOADER = 'style-loader';

const SASS_LOADERS = [{
  loader: 'css-loader',
  query: {
    url               : false,
    modules           : true,
    sourceMap         : __DEV__,
    minimize          : false,
    discardDuplicates : !__DEV__,
    importLoaders     : 2,
    localIdentName    : __DEV__ ? '[name]__[local]___[hash:base64:5]' : '[hash:base64:5]',
  },
}, {
  loader: 'postcss-loader',
}, {
  loader: 'sass-loader',
}];

webpackConfig.plugins = [
  new HappyPack({
    id: 'js',
    threadPool: happyThreadPool,
    loaders: [
      'babel-loader?' + JSON.stringify(objectAssign({}, config.compiler_babel_query, config.compiler_babel_options)),
    ],

    // make happy more verbose with HAPPY_VERBOSE=yes
    verbose: process.env.HAPPY_VERBOSE === 'yes',
  }),
  new HappyPack({
    id: 'styles',
    threadPool: happyThreadPool,
    loaders : __DEV__
      ? [STYLE_LOADER, ...SASS_LOADERS]
      : SASS_LOADERS,

    // make happy more verbose with HAPPY_VERBOSE=yes
    verbose: process.env.HAPPY_VERBOSE === 'yes',
  }),
  new webpack.LoaderOptionsPlugin({
    debug    : __DEV__,
    minimize : !__DEV__,
    options  : {
      context: process.cwd(),
      postcss: [
        sassyImport({}),
        cssnano({
          autoprefixer : {
            add      : true,
            remove   : true,
            browsers : ['last 2 versions'],
          },
          discardComments : {
            removeAll : true,
          },
          discardUnused : false,
          mergeIdents   : false,
          reduceIdents  : false,
          safe          : true,
          sourcemap     : __DEV__,
        }),
      ],
      sassLoader: {
        data         : '$env: ' + config.env + ';',
        outputStyle  : 'expanded',
        includePaths : [
          paths.client(),
          paths.base('node_modules'),
          paths.client('styles'),
        ],
      },
    },
  }),
  new webpack.DefinePlugin(merge(config.globals, {
    'process.env' : {
      PARSE_MODULE_PATH : JSON.stringify('parse'),
      SSR               : JSON.stringify(config.ssrEnabled),
    },
  })),
  new HtmlWebpackPlugin({
    template : paths.client('index.html'),
    hash     : false,
    favicon  : paths.public('favicon.ico'),
    filename : 'index.html',
    inject   : 'body',
    minify   : {
      collapseWhitespace : !__DEV__,
    },
  }),
];

if (__DEV__) {
  log('Enable plugins for live development (HMR, NoErrors).');
  webpackConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
} else {
  log('Enable plugins for production (Offline, AggressiveMergingPlugin & UglifyJS).');
  webpackConfig.plugins.push(
    new webpack.HashedModuleIdsPlugin(),
    new InlineManifestWebpackPlugin(),
    new WebpackMd5Hash(),
    new OfflinePlugin({
      relativePaths: false,
      publicPath: config.compiler_public_path,
      ServiceWorker:{
        events: true,
      },
      caches: {
        main: [
          ...config.compiler_offline_assets,
          ':rest:',
        ],
      },
      excludes: [
        'index.html',
      ],
      externals : config.compiler_offline_assets,
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap : false,
      minimize  : true,
      compress  : {
        unused        : true,
        dead_code     : true,
        warnings      : false,
        drop_debugger : true,
        drop_console  : true,
        hoist_vars    : true,
        screw_ie8     : true,
      },
    })
  );
}

webpackConfig.plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
    names      : __DEV__ ? ['polyfills', 'vendor'] : ['polyfills', 'vendor', 'manifest'],
    minChuncks : Infinity,
  }),
);

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules = [{
  test    : /\.js$/,
  exclude : [
    path.resolve(process.cwd(), 'node_modules'),
  ],
  use : [
    'happypack/loader?id=js',
  ],
}, {
  test   : /\.html$/,
  loader : 'ejs-loader',
}, {
  test: /\.graphql$/,
  exclude : [
    path.resolve(process.cwd(), 'node_modules'),
  ],
  loader: 'graphql-tag/loader',
}];

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
webpackConfig.module.rules.push({
  test    : /\.scss$/,
  exclude : [],
  use : [
    'happypack/loader?id=styles',
  ],
});

// File loaders
/* eslint-disable */
webpackConfig.module.rules.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/,    loader: 'url-loader?limit=8192' }
);
/* eslint-enable */

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!__DEV__) {
  log('Apply ExtractTextPlugin to CSS loaders.');
  webpackConfig.module.rules.filter((loader) =>
    /scss/.test(loader.test)
  ).forEach((loader) => {
    loader.use = ExtractTextPlugin.extract({
      fallback : STYLE_LOADER,
      use      : SASS_LOADERS,
    });
  });

  webpackConfig.plugins.push(
    new ExtractTextPlugin({
      filename    : '[name].[contenthash].css',
      disable     : false,
      ignoreOrder : true,
      allChunks   : true,
    })
  );
}

module.exports = webpackConfig;

