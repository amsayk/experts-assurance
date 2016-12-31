const webpack = require('webpack');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VendorChunkPlugin = require('webpack-vendor-chunk-plugin');
const OfflinePlugin = require('offline-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('build/config');
const debug = require('debug')('app:webpack:config');

const paths = config.utils_paths;

debug('Creating configuration.');
const webpackConfig = {
  name    : 'client',
  target  : 'web',
  devtool : config.compiler_devtool,
  babel   : config.compiler_babel_options,
  resolve : {
    modulesDirectories: [
      paths.base(),
      paths.base('node_modules'),
      paths.client(),
    ],
    alias: {

    },
    extensions : ['', '.js', '.json'],
  },
  module : {},
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = ['babel-polyfill', paths.client('app.js')];

webpackConfig.entry = {
  app : __DEV__
    ? APP_ENTRY.concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
    : APP_ENTRY,
  vendor : config.compiler_vendors,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename   : `[name].[${config.compiler_hash_type}].js`,
  path       : paths.dist(),
  publicPath : config.compiler_public_path,
};

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {};

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  new HtmlWebpackPlugin({
    template : paths.client('index.html'),
    hash     : false,
    favicon  : paths.public('favicon.ico'),
    filename : 'index.html',
    inject   : 'body',
    minify   : {
      collapseWhitespace : true,
    },

    // local variables
    title    : config.title + ' · ' + config.appName,
  }),
];

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).');
  webpackConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
} else {
  debug('Enable plugins for production (Offline, OccurenceOrder, Dedupe & UglifyJS).');
  webpackConfig.plugins.push(
    new OfflinePlugin({
      relativePaths: false,
      publicPath: config.compiler_public_path,
      ServiceWorker:{
        events: true,
      },
      caches: {
        main    : [
          ...config.compiler_offline_assets,
          ':rest:',
        ],
      },
      excludes  : [],
      externals : config.compiler_offline_assets,
    }),
    new VendorChunkPlugin('vendor'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
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
    names : ['vendor'],
  })
);

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test    : /\.js$/,
  exclude : /node_modules/,
  loader  : 'babel',
  query   : config.compiler_babel_query,
}, {
  test   : /\.json$/,
  loader : 'json',
}, {
  test   : /\.html$/,
  loader : 'ejs',
}, {
  test: /\.(graphql|gql)$/,
  exclude: /node_modules/,
  loader: 'graphql-tag/loader',
}];

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = `css?sourceMap&-minize&modules&importLoaders=2&localIdentName=${__DEV__ ? '[name]__[local]___[hash:base64:5]' : '[hash:base64:5]'}`;  // eslint-disable-line max-len

webpackConfig.module.loaders.push({
  test    : /\.scss$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss',
    'sass?sourceMap',
  ],
});

webpackConfig.sassLoader = {
  data         : '$env: ' + config.env + ';',
  outputStyle  : 'expanded',
  includePaths : paths.client('styles'),
};

webpackConfig.postcss = [
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
];

// File loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
);
/* eslint-enable */

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!__DEV__) {
  debug('Apply ExtractTextPlugin to CSS loaders.');
  webpackConfig.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const first = loader.loaders[0];
    const rest = loader.loaders.slice(1);
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete loader.loaders;
  });

  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks : true,
    })
  );
}

module.exports = webpackConfig;

