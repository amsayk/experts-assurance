import { GraphQLNonNull } from 'graphql';
import isObject from 'lodash.isobject';
import invariant from 'invariant';

export default function parseGraphqlObjectFields(fields) {
  return fields.reduce(function (fields, fieldName) {
    fields[fieldName] = (obj, {}, {}, info) => {
      const value = typeof obj.get === 'function' ? obj.get(fieldName) : obj[fieldName];
      invariant(value ? isObject(value) : true, 'value for ' + fieldName + ' must be an object.')
      if (info.returnType instanceof GraphQLNonNull) {
        invariant(!(value === null || value === undefined), 'NonNull field: ' + fieldName + ' returned nothing.');
      }
      return value
        ? (value.toJSON ? { id: value.id, ...value.toJSON() } : value)
        : null;
    };
    return fields;
  }, {});
};

