const objectAssign = require('object-assign');

const babelRegister = require('babel-core/register');

const babelOptions = require('../scripts/getBabelOptions')({
  moduleMap: {
    'messages'         : 'common/messages',
    'getCurrentUser'   : 'common/getCurrentUser',
    'environment'      : 'common/environment',
    'dataIdFromObject' : 'common/dataIdFromObject',
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
        'transform-react-inline-elements',
      ],
    },
  },
  retainLines: true,
  sourceMaps: true,
}
));

