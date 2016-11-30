import { GraphQLNonNull } from 'graphql';
import invariant from 'invariant';

export default function parseGraphqlScalarFields(fields) {
  return fields.reduce(function (fields, fieldName) {
    fields[fieldName] = (obj, _, __, info) => {
      const value = typeof obj.get === 'function' ? obj.get(fieldName) : obj[fieldName];
      if (info.returnType instanceof GraphQLNonNull) {
        invariant(!(value === null || value === undefined), 'NonNull field: ' + fieldName + ' returned nothing.');
      }
      return value === null || value === undefined ? null : value;
    };
    return fields;
  }, {});
}

