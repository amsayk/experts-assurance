import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import parseGraphqlObjectFields from '../parseGraphqlObjectFields';

import signUpValidations from 'routes/Signup/validations';
import resetValidations from 'routes/PasswordReset/validations';
import accountSettingsValidations from 'routes/Settings/containers/Account/AccountSettingsContainer/validations';
import passwordValidations from './passwordValidations';

import { fromJS } from 'immutable';

export const schema = [`

  # ------------------------------------
  # Set password
  # ------------------------------------

  input SetPasswordPayload {
    currentPassword: String
    newPassword: String
  }

  type SetPasswordResponse {
    errors: JSON!
  }

  # ------------------------------------
  # Update account settings
  # ------------------------------------
  input UpdateAccountSettingsPayload {
    displayName: String!
  }

  type UpdateAccountSettingsResponse {
    user: User,
    errors: JSON!
  }

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
  # Resend email verification
  # ------------------------------------
  input ResendEmailVerificationPayload {
    email: String!
  }

  type ResendEmailVerificationResponse {
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

    business: Business
  }

`];

export const resolvers = {

  User: Object.assign(
    {
      business(user, {}, context) {
        return context.Business.getForUser(user.id);
      },
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

  SetPasswordResponse : Object.assign(
    {
    },
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  UpdateAccountSettingsResponse : Object.assign(
    {
    },
    parseGraphqlObjectFields([
      'user',
    ]),
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  CreateUserResponse : Object.assign(
    {
    },
    parseGraphqlObjectFields([
      'user',
    ]),
    parseGraphqlScalarFields([
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

  ResendEmailVerificationResponse : Object.assign(
    {
    },
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  Mutation: {
    async updateAccountSettings(_, { payload }, context) {
      try {
        await accountSettingsValidations.asyncValidate(fromJS(payload));
      } catch (errors) {
        return { errors };
      }
      const user = await context.Users.updateAccountSettings(payload);
      return { user, errors: {} };
    },
    async setPassword(_, { payload }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }
      try {
        await passwordValidations.asyncValidate(fromJS({ ...payload, user: context.user }));
      } catch (errors) {
        return { errors };
      }
      await context.Users.setPassword(payload);
      return { errors: {} };
    },
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
    async resendEmailVerification(_, { info }, context) {
      try {
        await resetValidations.asyncValidate(fromJS(info));
      } catch (errors) {
        return { errors };
      }
      await context.Users.resendEmailVerification(info);
      return { errors: {} };
    },
  },

  Query: {
    getUser(_, { id }, context) {
      return context.Users.get(id);
    },
  },

};

