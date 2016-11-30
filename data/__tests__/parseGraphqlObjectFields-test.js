'use strict';

import objectAssign from 'object-assign';
import parseGraphqlObjectFields from '../parseGraphqlObjectFields';
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

describe('parseGraphqlObjectFields', () => {
  const FIELD_NAME = 'field';
  const ERR_MSG = new RegExp('NonNull field: ' + FIELD_NAME + ' returned nothing.');
  const NO_PRIMITIVE_ERR_MSG = new RegExp('value for ' + FIELD_NAME + ' must be an object.');
  const { [FIELD_NAME] : fieldResolver } = parseGraphqlObjectFields([
    FIELD_NAME,
  ]);
  const graphqlObjectType = new GraphQLObjectType({
    name: 'TestObject',
    fields: ({
      objectId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      prop1: {
        type: GraphQLString,
      },
    }),
  });

  it('throws when object is a primitive value', function () {
    const obj = { [FIELD_NAME]: 'string value' };
    expect(() => {
      return fieldResolver(obj, {}, {}, {});
    }).toThrowError(NO_PRIMITIVE_ERR_MSG);
  });

  describe('with parse objects', function () {
    function toParseObject(obj) {
      const ret = objectAssign({}, obj);
      ret.toJSON = jest.fn().mockReturnValue({
        ...obj,
      });
      ret.id = obj.objectId;
      return ret;
    }
    const objWhichReturns = (returnValue) => ({
      get: jest.fn().mockReturnValue(returnValue),
    });

    describe('nullable fields', function () {
      const info = {
        returnType: graphqlObjectType,
      };

      it('resolves when object is not null', function () {
        const randomObj = toParseObject({ objectId: 'id', prop1: 'prop1' });
        const obj = objWhichReturns(randomObj);
        const expected = {id: randomObj.objectId, objectId: randomObj.objectId, prop1: randomObj.prop1};
        expect(fieldResolver(obj, {}, {}, info)).toEqual(expected);
        expect(obj.get.mock.calls.length).toBe(1);
        expect(randomObj.toJSON.mock.calls.length).toBe(1);
      });

      it('resolves when object is null', function () {
        const nullObj = objWhichReturns(null);
        expect(fieldResolver(nullObj, {}, {}, info)).toEqual(null);
        expect(nullObj.get.mock.calls.length).toBe(1);
      });

      it('returns null when object is undefined', function () {
        const undefinedObj = objWhichReturns(undefined);
        expect(fieldResolver(undefinedObj, {}, {}, info)).toEqual(null);
        expect(undefinedObj.get.mock.calls.length).toBe(1);
      });

    });

    describe('non null fields', function () {
      const info = {
        returnType: new GraphQLNonNull(graphqlObjectType),
      };

      it('resolves when object is not null', function () {
        const randomObj = toParseObject({ objectId: 'id', prop1: 'prop1' });
        const obj = objWhichReturns(randomObj);
        const expected = {id: randomObj.objectId, objectId: randomObj.objectId, prop1: randomObj.prop1};
        expect(fieldResolver(obj, {}, {}, info)).toEqual(expected);
        expect(obj.get.mock.calls.length).toBe(1);
        expect(randomObj.toJSON.mock.calls.length).toBe(1);
      });

      it('throws when object is null', function () {
        const nullObj = objWhichReturns(null);
        expect(() => {
          return fieldResolver(nullObj, {}, {}, info);
        }).toThrowError(ERR_MSG);

        expect(nullObj.get.mock.calls.length).toBe(1);
      });

      it('throws when object is undefined', function () {
        const obj = objWhichReturns(undefined);
        expect(() => {
          return fieldResolver(obj, {}, {}, info);
        }).toThrowError(ERR_MSG);

        expect(obj.get.mock.calls.length).toBe(1);
      });
    });

  });

  describe('with plain js objects', function () {
    const objWhichReturns = (returnValue) => ({
      [FIELD_NAME]: returnValue,
    });

    describe('nullable fields', function () {
      const info = {
        returnType: graphqlObjectType,
      };

      it('resolves when object is not null', function () {
        const randomObj = { objectId: 'id', prop1: 'prop1' };
        const obj = objWhichReturns(randomObj);
        expect(fieldResolver(obj, {}, {}, info)).toEqual(randomObj);
      });

      it('resolves when object is null', function () {
        const nullObj = objWhichReturns(null);
        expect(fieldResolver(nullObj, {}, {}, info)).toEqual(null);
      });

      it('returns null when object is undefined', function () {
        const undefinedObj = objWhichReturns(undefined);
        expect(fieldResolver(undefinedObj, {}, {}, info)).toEqual(null);
      });
    });

    describe('non null fields', function () {
      const info = {
        returnType: new GraphQLNonNull(graphqlObjectType),
      };

      it('resolves when object is not null', function () {
        const randomObj = { objectId: 'id', prop1: 'prop1' };
        const obj = objWhichReturns(randomObj);
        expect(fieldResolver(obj, {}, {}, info)).toEqual(randomObj);
      });

      it('throws when object is null', function () {
        const nullObj = objWhichReturns(null);
        expect(() => {
          return fieldResolver(nullObj, {}, {}, info);
        }).toThrowError(ERR_MSG);
      });

      it('throws when object is undefined', function () {
        const obj = objWhichReturns(undefined);
        expect(() => {
          return fieldResolver(obj, {}, {}, info);
        }).toThrowError(ERR_MSG);
      });
    });

  });
});

