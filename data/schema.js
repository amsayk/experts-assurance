import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

import merge from 'lodash.merge';

import moment from 'moment';

import invariant from 'invariant';

import parseJSONLiteral from './parseJSONLiteral';

import { schema as userSchema, resolvers as userResolvers } from './user/schema';

const rootSchema = [`

  scalar Date

  scalar JSON

  type Query {
    getUser(id: ID!): User
  }

  type Mutation {

    # Accounts
    signUp(info: CreateUserPayload!): CreateUserResponse!
    passwordReset(info: PasswordResetPayload!): PasswordResetResponse!
    resendPasswordVerification(info: ResendVerificationPayload!): ResendVerificationResponse!
  }

  schema {
    query: Query
    mutation: Mutation
  }

`];

const rootResolvers = {
  Date: {
    __parseValue(value) {
      invariant(typeof value === 'number', 'Number required.');
      return new Date(value); // value from the client
    },
    __serialize(value: any): number {
      if (value instanceof Date) {
        return value.getTime();   // value sent to the client
      }

      if (moment.isMoment(value)) {
        return value.valueOf();  // value sent to the client
      }

      if (typeof value === 'string' || Number.isInteger(value)) {
        const mDate = moment.utc(value);
        if (mDate.isValid()) {
          return mDate.valueOf();
        }
      }

      throw new Error('Field error: value is an invalid Date');
    },
    __parseLiteral(ast: any): ?number {
      if (ast.kind !== Kind.INT) {
        throw new GraphQLError('Query error: Can only parse integers to dates but got a: ' + ast.kind, [ast]);
      }
      return (parseInt(ast.value, 10)); // ast value is always in string format
    },
  },

  JSON: {
    __parseLiteral: parseJSONLiteral,
    __serialize: value => value,
    __parseValue: value => value,
  },

};

export const schema = [
  ...rootSchema,
  ...userSchema,
];

export const resolvers = merge({}, rootResolvers, userResolvers);

