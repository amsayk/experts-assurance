import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import parseGraphqlObjectFields from '../parseGraphqlObjectFields';

import { fromJS } from 'immutable';

import businessValidations from 'routes/Settings/containers/Business/BusinessDetailsContainer/validations';

export const schema = [`

  # ------------------------------------
  # Business type
  # ------------------------------------
  type Business {
    id: ID!

    displayName: String!
    description: String

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
    async updateUserBusiness(_, { userId, payload }, context) {
      try {
        await businessValidations.asyncValidate(fromJS(payload));
      } catch (errors) {
        return { errors };
      }
      const business = await context.Business.updateUserBusiness(userId, payload);
      return { business, errors: {} };
    },
  },

  Query: {
    getUserBusiness(_, { userId }, context) {
      return context.Business.getForUser(userId);
    },
  },

};

