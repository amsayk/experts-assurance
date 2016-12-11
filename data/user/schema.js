import parseGraphqlScalarFields from '../parseGraphqlScalarFields';

import signUpValidations from 'routes/Signup/validations';
import resetValidations from 'routes/PasswordReset/validations';

import { fromJS } from 'immutable';

export const schema = [`

  # ------------------------------------
  # Create account
  # ------------------------------------
  type CreateUserResponse {
    user: User,
    errors: JSON!
  }

  input CreateUserPayload {
    email: String!
    password: String!
    passwordConfirmation: String!
    recaptcha: Boolean!
  }

  # ------------------------------------
  # Password reset
  # ------------------------------------
  type PasswordResetResponse {
    errors: JSON!
  }

  input PasswordResetPayload {
    email: String!
  }

  # ------------------------------------
  # Password reset
  # ------------------------------------
  input ResendVerificationPayload {
    email: String!
  }

  type ResendVerificationResponse {
    errors: JSON!
  }

  # ------------------------------------
  # User type
  # ------------------------------------
  type User {
    id: ID!

    displayName: String
    email: String!
    username: String!
    sessionToken: String!

    emailVerified: Boolean

    createdAt: Date!
    updatedAt: Date!
  }

`];

export const resolvers = {

  User: Object.assign(
    {
    },
    parseGraphqlScalarFields([
      'id',
      'displayName',
      'email',
      'username',
      'sessionToken',
      'emailVerified',
      'createdAt',
      'updatedAt',
    ])
  ),

  CreateUserResponse : Object.assign(
    {
    },
    parseGraphqlScalarFields([
      'user',
      'errors',
    ])
  ),

  PasswordResetResponse : Object.assign(
    {
    },
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  ResendVerificationResponse : Object.assign(
    {
    },
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  Mutation: {
    async signUp(_, { info }, context) {
      try {
        await signUpValidations.asyncValidate(fromJS(info));
      } catch (errors) {
        return { errors };
      }
      const user = await context.Users.signUp(info);
      return { user, errors: {} };
    },
    async passwordReset(_, { info }, context) {
      try {
        await resetValidations.asyncValidate(fromJS(info));
      } catch (errors) {
        return { errors };
      }
      await context.Users.passwordReset(info);
      return { errors: {} };
    },
    async resendPasswordVerification(_, { info }, context) {
      try {
        await resetValidations.asyncValidate(fromJS(info));
      } catch (errors) {
        return { errors };
      }
      await context.Users.resendPasswordVerification(info);
      return { errors: {} };
    },
  },

  Query: {
    getUser(_, { id }, context) {
      return context.Users.get(id);
    },
  },

};

