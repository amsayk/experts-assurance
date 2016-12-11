'use strict';

import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

describe('parseGraphqlScalarFields', () => {
  const FIELD_NAME = 'field';
  const ERR_MSG = new RegExp('NonNull field: ' + FIELD_NAME + ' returned nothing.');
  const { [FIELD_NAME] : fieldResolver } = parseGraphqlScalarFields([
    FIELD_NAME,
  ]);

  describe('with parse objects', function () {
    const objWhichReturns = (returnValue) => ({
      get: jest.fn().mockReturnValue(returnValue),
    });

    it('resolves when object is zero', function () {
      const obj = objWhichReturns(0);

      const nullableInfo = {
        returnType: GraphQLInt,
      };

      expect(fieldResolver(obj, {}, {}, nullableInfo)).toEqual(0);
      expect(obj.get.mock.calls.length).toBe(1);

      const nonNullableInfo = {
        returnType: new GraphQLNonNull(GraphQLInt),
      };

      expect(fieldResolver(obj, {}, {}, nonNullableInfo)).toEqual(0);
      expect(obj.get.mock.calls.length).toBe(2);
    });

    describe('nullable fields', function () {
      const info = {
        returnType: GraphQLString,
      };

      it('resolves when object is not null', function () {
        const randomString = 'random string';
        const obj = objWhichReturns(randomString);
        expect(fieldResolver(obj, {}, {}, info)).toEqual(randomString);
        expect(obj.get.mock.calls.length).toBe(1);
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
        returnType: new GraphQLNonNull(GraphQLString),
      };

      it('resolves when object is not null', function () {
        const randomString = 'random string';
        const obj = objWhichReturns(randomString);
        expect(fieldResolver(obj, {}, {}, info)).toEqual(randomString);
        expect(obj.get.mock.calls.length).toBe(1);
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

    xdescribe('id field', function () {

    });
  });

  describe('with plain js objects', function () {
    const objWhichReturns = (returnValue) => ({
      [FIELD_NAME]: returnValue,
    });

    it('resolves when object is zero', function () {
      const obj = objWhichReturns(0);

      const nullableInfo = {
        returnType: GraphQLInt,
      };

      expect(fieldResolver(obj, {}, {}, nullableInfo)).toEqual(0);

      const nonNullableInfo = {
        returnType: new GraphQLNonNull(GraphQLInt),
      };

      expect(fieldResolver(obj, {}, {}, nonNullableInfo)).toEqual(0);
    });

    describe('nullable fields', function () {
      const info = {
        returnType: GraphQLString,
      };

      it('resolves when object is not null', function () {
        const randomString = 'random string';
        const obj = objWhichReturns(randomString);
        expect(fieldResolver(obj, {}, {}, info)).toEqual(randomString);
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
        returnType: new GraphQLNonNull(GraphQLString),
      };

      it('resolves when object is not null', function () {
        const randomString = 'random string';
        const obj = objWhichReturns(randomString);
        expect(fieldResolver(obj, {}, {}, info)).toEqual(randomString);
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

