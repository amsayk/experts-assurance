import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

import {
  makeExecutableSchema,
} from 'graphql-tools';

import merge from 'lodash.merge';

import moment from 'moment';

import invariant from 'invariant';

import parseJSONLiteral from './parseJSONLiteral';

import { schema as userSchema, resolvers as userResolvers } from './user/schema';
import { schema as businessSchema, resolvers as businessResolves } from './business/schema';

const log = require('log')('app:server:graphql');

const rootSchema = [`

  scalar Date

  scalar JSON

  type Query {
    # Accounts
    getUser(id: ID!): User

    # Business
    getUserBusiness(userId: ID!): Business
  }

  type Mutation {
    # Business
    updateUserBusiness(userId: ID!, payload: UpdateUserBusinessPayload!): UpdateUserBusinessResponse!

    # Account
    setPassword(payload: SetPasswordPayload!): SetPasswordResponse!
    changeEmail(payload: ChangeEmailPayload!): ChangeEmailResponse!
    updateAccountSettings(payload: UpdateAccountSettingsPayload!): UpdateAccountSettingsResponse!
    signUp(info: CreateUserPayload!): CreateUserResponse!
    passwordReset(info: PasswordResetPayload!): PasswordResetResponse!
    resendEmailVerification(info: ResendEmailVerificationPayload!): ResendEmailVerificationResponse!
  }

  type Subscription {
    # Subscription fires every time a business changes
    businessChange(id: ID!): Business
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
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

const schema = [
  ...rootSchema,
  ...userSchema,
  ...businessSchema,
];

const resolvers = merge({}, rootResolvers, userResolvers, businessResolves);

export default makeExecutableSchema({
  typeDefs                : schema,
  resolvers               : resolvers,
  allowUndefinedInResolve : false,
  logger                  : { log: (e) => log.error('[GRAPHQL ERROR]', e.stack) },
});

