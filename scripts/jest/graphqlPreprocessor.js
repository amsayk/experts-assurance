const gql = require('graphql-tag');

module.exports = {
  process(src, filename) {
    return `module.exports = ${JSON.stringify(gql`${src}`)};`; // eslint-disable-line graphql/template-strings

  },

};

