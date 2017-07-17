const objectAssign = require('object-assign');

const babelRegister = require('babel-core/register');

const babelOptions = require('scripts/getBabelOptions')({
  moduleMap: {
    'validation'                         : 'common/validation',
    'getCurrentUser'                     : 'common/getCurrentUser',
    'vars'                               : 'common/vars',
    'roles'                              : 'common/roles',
    'dataIdFromObject'                   : 'common/dataIdFromObject',
    'log'                                : 'common/log/server',
    'libphonenumber'                     : 'common/libphonenumber',
    'slug'                               : 'common/slug',

    // For SSR use
    'loadScript'                         : 'utils/loadScript',
    'validation-messages'                : 'common/messages/validation-messages',
    'countries'                          : 'common/countries',
    'authWrappers/UserIsAuthenticated'   : 'utils/auth/authWrappers/UserIsAuthenticated',
    'authWrappers/NotAuthenticated'      : 'utils/auth/authWrappers/NotAuthenticated',

    'Clipboard'                          : 'utils/Clipboard',

    // TODO: remove when subscriptions-transport-ws gets updated
    'graphql-tag/printer'                : 'graphql/language/printer',

    // cookie storage
    'StorageController.cookie'           : 'common/utils/StorageController.cookie',
    'FileController'                     : 'common/utils/FileController',

    'result-codes'                       : 'common/result-codes',
    'intl-formats'                       : 'common/intl-formats',
    'file-categories'                    : 'common/file-categories',

    'printDocRef'                        : 'common/printDocRef',
  },
  plugins: [
    // 'transform-async-to-generator',
    'transform-export-extensions',
  ],
  modules: true,
  regenerator : false,
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

const sass = require('node-sass');

const cssRequireHook = require('css-modules-require-hook');

cssRequireHook({
  extensions: ['.scss'],
  generateScopedName: config.env === 'production' ? '[hash:base64:5]' : '[name]__[local]___[hash:base64:5]',
  prepend: [
    // adding CSS Next plugin
  ],
  preprocessCss: (data) => sass.renderSync({
    data         : '$env: ' + config.env + ';\n' + data,
    outputStyle  : 'expanded',
    includePaths : [
      config.utils_paths.client(),
      config.utils_paths.base('node_modules'),
      config.utils_paths.client('styles'),
    ],
  }).css,
});

// Graphql require hook
const graphqlTransform = require('scripts/jest/transform/graphql');
require.extensions['.graphql'] = function graphqlModulesHook(m, filename) {
  const data = require('fs').readFileSync(filename, 'utf8');
  return m._compile(graphqlTransform.process(data, filename), filename);
};

// Set envs for `vars`
const vars = config.globals['process.env'];
Object.keys(vars).forEach((key) => {
  Object.defineProperty(process.env, key, {
    value: key === 'SERVER_URL'
    ? config.parse_server_url || `http://localhost:${config.server_port}${config.parse_server_mount_point}`
    : JSON.parse(vars[key])
  });
});

// Fix kue error handling
const worker = require('kue/lib/queue/worker');

const oldFn = worker.prototype.process;
worker.prototype.process = function (job, fn) {
  const self = this;
  const args = arguments;

  const domain = require('domain').create();
  domain.on('error', function (err) {
    self.failed(job, err, fn);
  });

  domain.run(function () {
    return oldFn.apply(self, args);
  });
};

// Initialize parse
require('./parse-config');

