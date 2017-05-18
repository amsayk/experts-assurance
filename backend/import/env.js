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

    // TODO: remove when subscriptions-transport-ws gets updated
    'graphql-tag/printer'                : 'graphql/language/printer',

    'result-codes'                       : 'common/result-codes',
  },
  plugins: [
    'transform-async-to-generator',
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
      ],
    },
  },
  retainLines: true,
  sourceMaps: true,
}));

const config = require('build/config');

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

