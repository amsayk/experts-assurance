const path = require('path');
const objectAssign = require('object-assign');
const babel = require('babel-core');
const createCacheKeyFunction = require('fbjs-scripts/jest/createCacheKeyFunction');
const jestPluginHoist = require('babel-plugin-jest-hoist');

const babelOptions = require('../getBabelOptions')({
  env: 'test',
  moduleMap: {
  },
  plugins: [
    jestPluginHoist
  ],
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
    path.join(__dirname, '..', 'getBabelOptions.js'),
  ]),
};

