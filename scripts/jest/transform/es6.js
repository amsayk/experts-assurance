const path = require('path');
const objectAssign = require('object-assign');
const babel = require('babel-core');
const createCacheKeyFunction = require('fbjs-scripts/jest/createCacheKeyFunction');
const jestPluginHoist = require('babel-plugin-jest-hoist');

const babelOptions = require('../getBabelOptions')({
  env: 'test',
  moduleMap: {
    'validation'            : 'common/validation',
    'vars'                  : 'common/vars',
    'roles'                 : 'common/roles',
    'validation-messages'   : 'common/messages/validation-messages',
    'loadScript'            : 'utils/loadScript',
    'log'                   : 'common/log/server',
    'countries'             : 'common/countries',

    // cookie storage
    'StorageController.cookie' : 'common/utils/StorageController.cookie',
    'FileController'           : 'common/utils/FileController',

    'result-codes'             : 'common/result-codes',
  },
  plugins: [
    jestPluginHoist,
  ],
  modules: true,
});

module.exports = {
  process(src, filename) {
    if (babel.util.canCompile(filename)) {
      const options = objectAssign({}, babelOptions, {
        filename: filename,
        retainLines: true,
      });
      return babel.transform(src, options).code;
    }
    return src;
  },

  getCacheKey: createCacheKeyFunction([
    __filename,
    path.join(path.dirname(require.resolve('babel-preset-fbjs')), 'package.json'),
    path.join(path.dirname(require.resolve('build/babel-preset')), 'package.json'),
    path.join(__dirname, '..', 'getBabelOptions.js'),
  ]),
};

