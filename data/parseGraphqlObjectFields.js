import { GraphQLNonNull } from 'graphql';
import isObject from 'lodash.isobject';
import invariant from 'invariant';

export default function parseGraphqlObjectFields(fields) {
  return fields.reduce(function (fields, fieldName) {
    fields[fieldName] = (obj, _, __, info) => {
      const value = typeof obj.get === 'function' ? obj.get(fieldName) : obj[fieldName];
      invariant(value ? isObject(value) : true, 'value for ' + fieldName + ' must be an object.');
      if (info.returnType instanceof GraphQLNonNull) {
        invariant(!(value === null || value === undefined), 'NonNull field: ' + fieldName + ' returned nothing.');
      }
      return value
        ? getParseOject(value)
        : null;
    };
    return fields;
  }, {});
}

async function getParseOject(object) {
  if (object.fetch) {
    const value = await object.fetch();
    return { id: value.id, ...value.toJSON() };
  }
  return object.toJSON ? { id: object.id, ...object.toJSON() } : object;
}

