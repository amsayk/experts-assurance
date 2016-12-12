const path = require('path');
module.exports = {
  root: true,
  extends: ['fbjs'],
  rules: {
    'space-before-function-paren': ['warn', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'graphql/template-strings': ['error', {
      env: 'apollo',
      schemaJsonFilepath: path.resolve(__dirname, 'data', 'schema.json')
    }]
  },
  plugins: [
    'graphql'
  ]
};

