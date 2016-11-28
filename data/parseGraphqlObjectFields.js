const error = require('debug')('app:server:graphql:error');

export default function parseGraphqlScalarFields(fields) {
  return fields.reduce(function(fields, fieldName) {
    fields[fieldName] = (obj) => {
      try {
        const value = obj[fieldName] || obj.get(fieldName);
        return value
          ? (value.toJSON ? { id: value.id, ...value.toJSON() } : value)
          : null;
      } catch (e) {
        error('Error in parseGraphqlScalarFields:', e);
        throw e;
      }
    }
    return fields;
  }, {});
};

