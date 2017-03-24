import { GraphQLNonNull } from 'graphql';
import isObject from 'lodash.isobject';
import invariant from 'invariant';

export default function parseGraphqlObjectFields(fields) {
  return fields.reduce(function (fields, fieldName) {
    fields[fieldName] = (obj, {}, {}, info) => {
      const value = typeof obj.get === 'function' ? obj.get(fieldName) : obj[fieldName];
      invariant(value ? isObject(value) : true, 'value for `' + fieldName + '` must be an object.');
      if (info.returnType instanceof GraphQLNonNull) {
        invariant(!(value === null || value === undefined), 'NonNull field: `' + fieldName + '` returned nothing.');
      }
      return value
        ? getParseOject(value)
        : null;
    };
    return fields;
  }, {});
}

async function getParseOject(object) {
  // if (object.fetch) {
  //   return await object.fetch({
  //     useMasterKey: true,
  //   }); // Using master key is the only way to get email to be included!
  // }
  return object;
}

