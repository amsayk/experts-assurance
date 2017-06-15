import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import parseGraphqlObjectFields from '../parseGraphqlObjectFields';

import { fromJS } from 'immutable';

import businessValidations from 'routes/Settings/containers/Business/BusinessDetailsContainer/validations';
import phoneNumberValidations from './phoneNumberValidations';

import { pubsub } from '../subscriptions';

import graphqlFields from 'graphql-fields';

export const schema = [`

  # Sort
  enum UsersSortKey {
    displayName
    date
  }

  enum SortDirection {
    SORT_DIRECTION_DESC
    SORT_DIRECTION_ASC
  }

  input UsersSortConfig {
    key: UsersSortKey
    direction: SortDirection
  }

  # Queries
  type UsersFetchResponse {
    cursor: Int!
    length: Int!
    users: [User!]!
  }

  input UsersFetchQuery {
    roles: [String!]
    queryString: String
    cursor: Int
    sortConfig: UsersSortConfig!
  }

  # search types

  enum ESUserType {
    EMPLOYEE
    AGENT
    CLIENT
  }

  type ESUserSource {
    id: ID
    name: String!
    email: String
    username: String!
    isAdmin: Boolean!
    type: ESUserType!
    date: Date!
    lastModified: Date!
  }

  type ESUser {
    _index: String!
    _type: String!
    _id: String!
    _score: Float!
    _source: ESUserSource!
  }

  type ESUsersQueryResponse {
    took: Int!
    total: Int!
    max_score: Float
    hits: [ESUser!]!
  }

  # Country
  enum Country {
    MA
  }

  # ------------------------------------
  # Business type
  # ------------------------------------
  type Business {
    id: ID!

    displayName: String
    description: String
    url: String

    country: Country
    addressLine1: String
    addressLine2: String
    city: String
    stateProvince: String
    postalCode: String

    phone: String
    taxId: String

    createdAt: Date!
    updatedAt: Date!
  }

  # ------------------------------------
  # Update user business
  # ------------------------------------
  input UpdateUserBusinessPayload {
    displayName: String!
    description: String
    url: String

    country: String
    addressLine1: String
    addressLine2: String
    city: String
    stateProvince: String
    postalCode: String

    phone: String
    taxId: String
  }

  type UpdateUserBusinessResponse {
    business: Business,
    errors: JSON!
  }

`];

export const resolvers = {

  Business: Object.assign(
    {
    },
    parseGraphqlScalarFields([
      'id',
      'displayName',
      'description',
      'url',

      'country',
      'addressLine1',
      'addressLine2',
      'city',
      'stateProvince',
      'postalCode',

      'phone',
      'taxId',
      'createdAt',
      'updatedAt',
    ])
  ),

  UpdateUserBusinessResponse : Object.assign(
    {
    },
    parseGraphqlObjectFields([
      'business',
    ]),
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  Mutation: {
    async updateUserBusiness(obj, { payload }, context) {
      try {
        await businessValidations.asyncValidate(fromJS(payload));
        await phoneNumberValidations.asyncValidate(fromJS(payload));
      } catch (errors) {
        return { errors };
      }
      const business = await context.Business.updateUserBusiness(payload);
      // publish subscription notification
      pubsub.publish('businessChangedChannel', business);
      return { business, errors: {} };
    },
  },

  Query: {
    getUsers(obj, { query }, context, info) {
      const topLevelFields = Object.keys(graphqlFields(info));
      return context.Business.getUsers(query, topLevelFields);
    },
    // searchUsers(obj, { queryString : q }, context) {
    //   return context.Business.searchUsers(q);
    // },
    esSearchUsers(obj, { queryString : q }, context) {
      return context.Business.esSearchUsers(q);
    },
  },

};

