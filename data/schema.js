import parseGraphqlScalarFields from 'data/parseGraphqlScalarFields';
import parseGraphqlObjectFields from 'data/parseGraphqlObjectFields';

import objectAssign from 'object-assign';

import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

import { makeExecutableSchema } from 'graphql-tools';

import merge from 'lodash.merge';

import moment from 'moment';

import invariant from 'invariant';

import parseJSONLiteral from './parseJSONLiteral';

import { schema as userSchema, resolvers as userResolvers } from './user/schema';
import {
  schema as businessSchema,
  resolvers as businessResolvers,
} from './business/schema';
import { schema as docSchema, resolvers as docResolvers } from './doc/schema';
import {
  schema as activitySchema,
  resolvers as activityResolvers,
} from './activity/schema';

const log = require('log')('app:server:graphql');

const rootSchema = [
  `

  type Download {
    data: String
    error: Error
  }

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

    searchVehicles(queryString: String): [Vehicle!]!
    vehicleByPlateNumber(plateNumber: String): Vehicle

    # activities
    timeline(cursor: Date, query: TimelineQuery!): TimelineResponse!

    # Observations
    getDocObservations(id: ID!, cursor: Date): DocObservationsResponse!

    # Docs
    getDoc(id: ID!): Doc
    getDocs(query: DocsFetchQuery!): DocsFetchResponse!
    esSearchDocs(queryString: String, state: DocState): ESDocsQueryResponse!
    esQueryDocs(query: ESDocsQueryPayload!): ESDocsQueryResponse!
    esQueryDocsToExcel(query: ESDocsQueryPayload!): Download!

    queryCompanies(queryString: String): [String!]!

    # Importations
    getImportation(id: ID!): Importation
    ongoingImportation: Importation

    # Files
    getDocFiles(id: ID!): [File!]!
    getFile(id: ID!): File

    recentDocs: [Doc!]!

    dashboard: Dashboard!

    openDashboard(
      durationInDays: Float!,
      cursor: Int = 0,
      validOnly: Boolean = false,
      sortConfig: ESSortConfig!
    ): DocsFetchResponse!

    openDashboardToExcel(
      durationInDays: Float!,
      cursor: Int = 0,
      validOnly: Boolean = false,
      sortConfig: ESSortConfig!
    ): Download!

    # closedDashboard(
    #   durationInDays: Float!,
    #   cursor: Int = 0,
    #   sortConfig: ESSortConfig!
    #   includeCanceled: Boolean = false,
    # ): DocsFetchResponse!

    isDocValid(id: ID!): Boolean!
    getInvalidDocs(
      category: String
      durationInDays: Float!
      cursor: Int = 0,
      sortConfig: ESSortConfig!
    ): DocsFetchResponse!
    getInvalidDocsToExcel(
      category: String
      durationInDays: Float!
      cursor: Int = 0,
      sortConfig: ESSortConfig!
    ): Download!
    getUnpaidDocs(
      durationInDays: Float!
      cursor: Int = 0,
      sortConfig: ESSortConfig!
    ): DocsFetchResponse!
    getUnpaidDocsToExcel(
      durationInDays: Float!
      cursor: Int = 0,
      sortConfig: ESSortConfig!
    ): Download!

    getLastRefNo(now: Date!): RefNo!

    # Doc validation
    getUsersByDisplayNameAndEmail(type: String!, displayName: String, email: String): [User!]!
    searchUsersByDisplayNameAndEmail(type: String!, displayName: String, email: String): [User!]!
  }

  type Mutation {
    # mutations
    addDoc(payload: AddDocPayload!, meta: AddDocMeta!): AddDocResponse!
    delDoc(id: ID!): DelOrRestoreDocResponse!
    restoreDoc(id: ID!): DelOrRestoreDocResponse!
    setManager(id: ID!, manager: ID!): SetManagerResponse!

    setState(id: ID!, state: DocState!): SetStateResponse!

    closeDoc(id: ID!, info: DocClosureInfo!, meta: CloseDocMeta = null): SetStateResponse!
    cancelDoc(id: ID!): SetStateResponse!

    setPay(id: ID!, info: DocPaymentInfo!): SetOrDelPayResponse!
    delPay(id: ID!): SetOrDelPayResponse!

    setDTValidation(id: ID!, info: DocValidationInfo!): SetOrDelDTValidationResponse!
    delDTValidation(id: ID!): SetOrDelDTValidationResponse!

    setNature(id: ID!, value: String): SetOrDelNatureResponse!
    delNature(id: ID!): SetOrDelNatureResponse!

    setPolice(id: ID!, value: String): SetOrDelPoliceResponse!
    delPolice(id: ID!): SetOrDelPoliceResponse!

    setMTRapports(id: ID!, info: DocMTRapportsInfo!): SetOrDelMTRapportsResponse!
    delMTRapports(id: ID!): SetOrDelMTRapportsResponse!

    # Files
    uploadFile(docId: ID!, category: String!, metadata: FileInput!): UploadFileResponse!
    delFile(id: ID!): DelOrRestoreFileResponse!
    restoreFile(id: ID!): DelOrRestoreFileResponse!

    # Importations
    Importation(info: ImportationPayload!): ImportationResponse!
    # startImportation(info: ImportationPayload!): ImportationResponse!
    # Import(id: ID!, doc: JSON!): ImportResponse!
    # finishImportation(id: ID!, endDate: Date!): ImportationResponse!

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
    revokeManagerAuthorization(id: ID!): AuthorizeManagerResponse!

    # auth
    logIn(username: String, password: String): LogInResponse!
    logOut: LogOutResponse!

  }

  type Subscription {
    # Subscription fires every time an event occurs
    onActivityEvent(sessionToken: String!): ActivityEventResponse!
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

`,
];

const rootResolvers = {
  Date: {
    __parseValue(value) {
      invariant(typeof value === 'number', 'Number required.');
      return new Date(value); // value from the client
    },
    __serialize(value: any): number {
      if (value instanceof Date) {
        return value.getTime(); // value sent to the client
      }

      if (moment.isMoment(value)) {
        return +value; // value sent to the client
      }

      if (typeof value === 'string' || Number.isInteger(value)) {
        const mDate = moment.utc(value);
        if (mDate.isValid()) {
          return +mDate; // value sent to the client
        }
      }

      throw new Error('Field error: value is an invalid Date');
    },
    __parseLiteral(ast: any): ?number {
      if (ast.kind !== Kind.INT) {
        throw new GraphQLError(
          'Query error: Can only parse integers to dates but got a: ' + ast.kind,
          [ast],
        );
      }
      return parseInt(ast.value, 10); // ast value is always in string format
    },
  },

  JSON: {
    __parseLiteral: parseJSONLiteral,
    __serialize: value => value,
    __parseValue: value => value,
  },

  Download: objectAssign(
    {},
    parseGraphqlScalarFields(['data']),
    parseGraphqlObjectFields(['error']),
  ),
};

const schema = [
  ...rootSchema,
  ...userSchema,
  ...businessSchema,
  ...docSchema,
  ...activitySchema,
];

const resolvers = merge(
  {},
  rootResolvers,
  userResolvers,
  businessResolvers,
  docResolvers,
  activityResolvers,
);

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers,
  allowUndefinedInResolve: false,
  logger: { log: e => log.error('[GRAPHQL ERROR]', require('util').inspect(e)) },
});
