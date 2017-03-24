import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import parseGraphqlObjectFields from '../parseGraphqlObjectFields';

import graphqlFields from 'graphql-fields';

export const schema = [`

  # Dashboard

  type PendingShape {
    count: Int!
  }
  type OpenShape {
    count: Int!
  }
  type ClosedShape {
    count: Int!
  }
  type CanceledShape {
    count: Int!
  }

  type Dashboard {
    pending: PendingShape!
    open: OpenShape!
    closed: ClosedShape!
    canceled: CanceledShape!
  }

  # Sort
  enum DocsSortKey {
    refNo
    date
  }

  input DocsSortConfig {
    key: DocsSortKey
    direction: SortDirection
  }

  # Queries

  type ESDocValidationState {
    date: Date!
    user: ESUserSource!
  }

  type ESDocClosureState {
    date: Date!
    user: ESUserSource!
    state: DocState!
  }

  type ESDocSource {
    id: ID!
    refNo: Int!
    refNo_string: String!
    state: DocState!
    vehicle: Vehicle!

    client: ESUserSource!
    agent: ESUserSource!
    insurer: ESUserSource # TODO: make this required.
    user: ESUserSource!

    validation: ESDocValidationState
    closure: ESDocClosureState

    date: Date!
    lastModified: Date!
  }

  type ESDoc {
    _index: String!
    _type: String!
    _id: String!
    _score: Int!
    highlight: [String!]!
    _source: ESDocSource!
  }

  input UserQuery {
    id: ID
    q: String
  }

  input DateRange {
    from: Date
    to: Date
  }

  input ESSortConfig {
    key: String
    direction: SortDirection
  }

  input ESDocsQueryPayload {
    q: String
    state: DocState

    agent: UserQuery
    client: UserQuery
    insurer: UserQuery

    range: DateRange
    validationRange: DateRange
    closureRange: DateRange

    validator: UserQuery
    closer: UserQuery
    user: UserQuery

    lastModified: Date

    sortConfig: ESSortConfig

    cursor: Int
  }

  type ESDocsQueryResponse {
    took: Int!
    length: Int!
    max_score: Float
    cursor: Int!
    hits: [ESDoc!]!
  }

  type DocsFetchResponse {
    cursor: Int!
    length: Int!
    docs: [Doc!]!
  }

  input DocsFetchQuery {
    queryString: String
    sortConfig: DocsSortConfig!
    state: DocState
    client: ID
    agent: ID
    insurer: ID
    cursor: Int
  }

  # ------------------------------------
  # DocState type
  # ------------------------------------
  enum DocState {
    PENDING
    OPEN
    CLOSED
    CANCELED
  }

  # ------------------------------------
  # Vehicle type
  # ------------------------------------
  type Vehicle {
    model: String!
    plateNumber: String!
  }

  # ------------------------------------
  # Validation type
  # ------------------------------------
  type DocValidationState {
    date: Date!
    user: User!
  }

  # ------------------------------------
  # Closure type
  # ------------------------------------
  type DocClosureState {
    date: Date!
    user: User!
    state: DocState!
  }

  # ------------------------------------
  # Doc type
  # ------------------------------------
  type Doc {
    id: ID!

    refNo: Int!
    date: Date!
    state: DocState!
    vehicle: Vehicle!

    client: User!
    agent: User!
    insurer: User #TODO: make this required.
    user: User!

    validation: DocValidationState
    closure: DocClosureState

    createdAt: Date!
    updatedAt: Date!

    business: Business
  }

`];

export const resolvers = {

  Vehicle: Object.assign(
    {
    },
    parseGraphqlObjectFields([
    ]),
    parseGraphqlScalarFields([
      'model',
      'plateNumber',
    ])
  ),

  // DocValidationState: Object.assign(
  //   {
  //     date : (doc) => doc.validation_date || doc.get('validation_date'),
  //     user : (doc) => doc.validation_user || doc.get('validation_user'),
  //   },
  // ),

  // DocClosureState: Object.assign(
  //   {
  //     date : (doc) => doc.closure_date || doc.get('closure_date'),
  //     state : (doc) => doc.closure_state || doc.get('closure_state'),
  //     user : (doc) => doc.closure_user || doc.get('closure_user'),
  //   },
  // ),

  Doc: Object.assign(
    {
    },
    {
      validation: (doc) => {
        const validation_date = doc.validation_date || doc.get('validation_date');
        const validation_user = doc.validation_user || doc.get('validation_user');

        if (validation_date && validation_user) {
          return {
            date : validation_date,
            user : validation_user,
          };
        }

        return null;
      },
      closure: (doc) => {
        const closure_date  = doc.closure_date  || doc.get('closure_date');
        const closure_state = doc.closure_state || doc.get('closure_state');
        const closure_user  = doc.closure_user  || doc.get('closure_user');

        if (closure_date && closure_state && closure_user) {
          return {
            date  : closure_date,
            state : closure_state,
            user  : closure_user,
          };
        }

        return null;
      },
    },
    parseGraphqlObjectFields([
      'business',

      'vehicle',

      'client',
      'agent',
      'insurer',
      'user',
    ]),
    parseGraphqlScalarFields([
      'id',
      'refNo',
      'date',
      'state',
      'createdAt',
      'updatedAt',
    ])
  ),

  ESDocSource: Object.assign(
    {
    },
    {
      validation: (doc) => {
        const validation_date = doc.validation_date;
        const validation_user = doc.validation_user;

        if (validation_date && validation_user) {
          return {
            date : validation_date,
            user : validation_user,
          }
        }
        return null;
      },
      closure: (doc) => {
        const closure_date  = doc.closure_date;
        const closure_state = doc.closure_state;
        const closure_user  = doc.closure_user;

        if (closure_date && closure_state && closure_user) {
          return {
            date  : closure_date,
            state : closure_state,
            user  : closure_user,
          };
        }

        return null;
      },
    },
  ),

  ESDoc: Object.assign(
    {
      highlight(_source, {}, {}) {
        return Object.keys(_source.highlight || {});
      },
    },
  ),

  Mutation: {

  },

  Query: {
    getDoc(obj, { id }, context) {
      return context.Docs.get(id);
    },
    getDocs(obj, { query }, context, info) {
      const topLevelFields = Object.keys(graphqlFields(info));
      return context.Docs.getDocs(query, topLevelFields);
    },
    usersByRoles(obj, { queryString, roles }, context) {
      return context.Docs.searchUsersByRoles(queryString, roles);
    },

    esUsersByRoles(obj, { queryString, roles }, context) {
      return context.Docs.esSearchUsersByRoles(queryString, roles);
    },
    esSearchDocs(obj, { queryString, state }, context) {
      return context.Docs.esSearchDocs(queryString, state);
    },
    esQueryDocs(obj, { query }, context) {
      return context.Docs.esQueryDocs(query);
    },

    pendingDashboard(_, { durationInDays }, context) {
      return context.Docs.pendingDashboard(durationInDays, context.Now);
    },
    openDashboard(_, { durationInDays }, context) {
      return context.Docs.openDashboard(durationInDays, context.Now);
    },
    closedDashboard(_, { durationInDays }, context) {
      return context.Docs.closedDashboard(durationInDays, context.Now);
    },

    recentDocs(_, {}, context) {
      return context.Docs.recent();
    },

    dashboard(_, {}, context, info) {
      const selectionSet = Object.keys(graphqlFields(info));
      return context.Docs.dashboard(selectionSet);
    },
  },

};

