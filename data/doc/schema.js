import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import parseGraphqlObjectFields from '../parseGraphqlObjectFields';

export const schema = [`

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

  DocValidationState: Object.assign(
    {
      user(validation, {}, context) {
        return context.Users.get(validation.user);
      }
    },
    parseGraphqlObjectFields([
    ]),
    parseGraphqlScalarFields([
      'date',
    ])
  ),

  DocClosureState: Object.assign(
    {
      user(closure, {}, context) {
        return context.Users.get(closure.user);
      }
    },
    parseGraphqlObjectFields([
    ]),
    parseGraphqlScalarFields([
      'date',
      'state',
    ])
  ),

  Doc: Object.assign(
    {
    },
    parseGraphqlObjectFields([
      'business',

      'vehicle',

      'client',
      'agent',
      'insurer',
      'user',

      'validation',
      'closure',
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
    getDocs(obj, { query }, context) {
      return context.Docs.getDocs(query);
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
  },

};

