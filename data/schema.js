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
import { schema as businessSchema, resolvers as businessResolvers } from './business/schema';
import { schema as docSchema, resolvers as docResolvers } from './doc/schema';
import { schema as activitySchema, resolvers as activityResolvers } from './activity/schema';

const log = require('log')('app:server:graphql');

const rootSchema = [`

  type Error {
    code: Int
  }

  type Deletion {
    user: User!
    date: Date!
  }

  scalar Date

  scalar JSON

  type Query {
    # Accounts
    getUser(id: ID!): User
    # usersByRoles(queryString: String, roles: [Role!]!): [User!]!
    esUsersByRoles(queryString: String, roles: [Role!]!): ESUsersQueryResponse!

    # Business
    getUsers(query: UsersFetchQuery!): UsersFetchResponse!
    # searchUsers(queryString: String): [User!]!
    esSearchUsers(queryString: String): ESUsersQueryResponse!

    # Activites
    timeline(cursor: Date, query: TimelineQuery!): TimelineResponse!

    # Docs
    getDoc(id: ID!): Doc
    getDocs(query: DocsFetchQuery!): DocsFetchResponse!
    esSearchDocs(queryString: String, state: DocState): ESDocsQueryResponse!
    esQueryDocs(query: ESDocsQueryPayload!): ESDocsQueryResponse!

    recentDocs: [Doc!]!

    dashboard: Dashboard!

    # Docs dashboard
    pendingDashboard(
      durationInDays: Int!,
      cursor: Int = 0,
      sortConfig: ESSortConfig!
    ): DocsFetchResponse!

    openDashboard(
      durationInDays: Int!,
      cursor: Int = 0,
      validOnly: Boolean = false,
      sortConfig: ESSortConfig!
    ): DocsFetchResponse!

    closedDashboard(
      durationInDays: Int!,
      cursor: Int = 0,
      sortConfig: ESSortConfig!
      includeCanceled: Boolean = false,
    ): DocsFetchResponse!

    getLastRefNo: RefNo!
  }

  type Mutation {
    # mutations
    addDoc(payload: AddDocPayload!): AddDocResponse!
    delDoc(id: ID!): DelDocResponse!
    setManager(id: ID!, manager: ID!): SetManagerResponse!
    setState(id: ID!, state: DocState!): SetStateResponse!

    # Business
    updateUserBusiness(payload: UpdateUserBusinessPayload!): UpdateUserBusinessResponse!

    # Account
    setPassword(payload: SetPasswordPayload!): SetPasswordResponse!
    changeEmail(payload: ChangeEmailPayload!): ChangeEmailResponse!
    updateAccountSettings(payload: UpdateAccountSettingsPayload!): UpdateAccountSettingsResponse!
    signUp(info: CreateUserPayload!): CreateUserResponse!
    passwordReset(info: PasswordResetPayload!): PasswordResetResponse!
    resendEmailVerification: ResendEmailVerificationResponse!

    authorizeManager(id: ID!): AuthorizeManagerResponse!

    # auth
    logIn(username: String, password: String): LogInResponse!
    logOut: LogOutResponse!

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
        return +value;  // value sent to the client
      }

      if (typeof value === 'string' || Number.isInteger(value)) {
        const mDate = moment.utc(value);
        if (mDate.isValid()) {
          return +mDate;   // value sent to the client
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
  ...docSchema,
  ...activitySchema,
];

const resolvers = merge(
  {}, rootResolvers, userResolvers, businessResolvers, docResolvers, activityResolvers);

export default makeExecutableSchema({
  typeDefs                : schema,
  resolvers               : resolvers,
  allowUndefinedInResolve : false,
  logger                  : { log: (e) => log.error('[GRAPHQL ERROR]', require('util').inspect(e)) },
});

