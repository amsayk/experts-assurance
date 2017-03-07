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
  },

};

