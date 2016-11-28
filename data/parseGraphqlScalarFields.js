const error = require('debug')('app:server:graphql:error');

import { GraphQLNonNull } from 'graphql';

export default function parseGraphqlScalarFields(fields) {
  return fields.reduce(function (fields, fieldName) {
    fields[fieldName] = (obj, {}, {}, info) => {
      let value;

      if (typeof obj.get === 'function') {
        value = obj.get(fieldName);
        if (value || value === 0) {
          return value;
        }

        if (value === null && !(info.returnType instanceof GraphQLNonNull)) {
          return value;
        }
      }

      value = obj[fieldName];

      if (value || value === 0) {
        return value;
      }

      if (value === null && !(info.returnType instanceof GraphQLNonNull)) {
        return value;
      }

      const errMsg = 'parseGraphqlScalarFields error: NonNull field: ' + fieldName + ' returned nothing.';

      error(errMsg);
      throw new Error(errMsg);

      return null;
    }
    return fields;
  }, {});
};

