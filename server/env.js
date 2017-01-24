const objectAssign = require('object-assign');

const babelRegister = require('babel-core/register');

const babelOptions = require('scripts/getBabelOptions')({
  moduleMap: {
    'validation'                         : 'common/validation',
    'getCurrentUser'                     : 'common/getCurrentUser',
    'vars'                               : 'common/vars',
    'dataIdFromObject'                   : 'common/dataIdFromObject',
    'log'                                : 'common/log',
    'libphonenumber'                     : 'common/libphonenumber',

    // For SSR use
    'loadScript'                         : 'utils/loadScript',
    'validation-messages'                : 'common/messages/validation-messages',
    'countries'                          : 'common/countries',
    'authWrappers/UserIsAuthenticated'   : 'utils/auth/authWrappers/UserIsAuthenticated',
    'authWrappers/NotAuthenticated'      : 'utils/auth/authWrappers/NotAuthenticated',
  },
  plugins: [
    'transform-runtime',
    'transform-export-extensions',
  ],
  modules: true,
});

babelRegister(objectAssign(babelOptions, {
  comments: false,
  compact: true,
  babelrc: false,
  env: {
    production: {
      minified: true,
      plugins: [
        'transform-react-remove-prop-types',
        'transform-react-constant-elements',
        // 'transform-react-inline-elements',
        'transform-react-router-optimize',
      ],
    },
  },
  retainLines: true,
  sourceMaps: true,
}));

const config = require('build/config');

if (config.ssrEnabled) {
  const sass = require('node-sass');

  const cssRequireHook = require('css-modules-require-hook');

  cssRequireHook({
    extensions: ['.scss'],
    generateScopedName: config.env === 'production' ? '[hash:base64:5]' : '[name]__[local]___[hash:base64:5]',
    preprocessCss: (data) => sass.renderSync({
      data,
      outputStyle  : 'expanded',
      includePaths : [
        config.utils_paths.base('node_modules'),
        config.utils_paths.client('styles'),
      ],
    }).css,
  });

  // Graphql require hook
  const graphqlProcessor = require('scripts/jest/graphqlPreprocessor');
  require.extensions['.graphql'] = function graphqlModulesHook(m, filename) {
    const data = require('fs').readFileSync(filename, 'utf8');
    return m._compile(graphqlProcessor.process(data, filename), filename);
  };
}

// Set envs for `vars`
const vars = config.globals['process.env'];
Object.keys(vars).forEach((key) => {
  Object.defineProperty(process.env, key, { value: JSON.parse(vars[key]) });
});

