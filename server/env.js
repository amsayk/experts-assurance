const objectAssign = require('object-assign');

const babelRegister = require('babel-core/register');

const babelOptions = require('../scripts/getBabelOptions')({
  moduleMap: {
    'validation'       : 'common/validation',
    'getCurrentUser'   : 'common/getCurrentUser',
    'vars'             : 'common/vars',
    'dataIdFromObject' : 'common/dataIdFromObject',
    'log'              : 'common/log',
    'libphonenumber'   : 'common/libphonenumber',
  },
  plugins: [
    'transform-runtime',
    'transform-export-extensions',
  ],
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

require.ensure = function ensure(modules, callback) {
  setImmediate(callback);
};

