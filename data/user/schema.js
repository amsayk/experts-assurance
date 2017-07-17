import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import parseGraphqlObjectFields from '../parseGraphqlObjectFields';

import { Role_ADMINISTRATORS, Role_MANAGERS, userHasRoleAll, userHasRoleAny, isAuthorized, userVerified } from 'roles';

import objectAssign from 'object-assign';

import * as codes from 'result-codes';

import signUpValidations from 'routes/Signup/validations';
import passwordResetValidations from 'routes/PasswordReset/validations';
import accountSettingsValidations from 'routes/Settings/containers/Account/AccountSettingsContainer/validations';
import emailValidations from './emailValidations';
import passwordValidations from './passwordValidations';

import config from 'build/config';

import { fromJS } from 'immutable';

const log = require('log')('app:server:graphql');

export const schema = [`

  type AuthorizeManagerResponse {
    user: User
    activities : [Activity!]!
    error: Error
  }

  type LogInResponse {
    user: User
    error: Error
  }

  type LogOutResponse {
    error: Error
  }

  enum Role {
    ADMINISTRATORS
    MANAGERS
    AGENTS
    CLIENTS
  }

  # ------------------------------------
  # Change email
  # ------------------------------------

  input ChangeEmailPayload {
    email: String
  }

  type ChangeEmailResponse {
    user: User!
    errors: JSON!
  }

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
    displayName: String
    email: String
    password: String
    role: String
    recaptcha: String!
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
  type ResendEmailVerificationResponse {
    errors: JSON!
  }

  type Authorization {
    user: User!
    date: Date!
  }

  # ------------------------------------
  # User type
  # ------------------------------------
  type User {
    id: ID!

    displayName: String
    email: String
    username: String!
    roles: [Role!]!
    sessionToken: String!

    emailVerified: Boolean

    createdAt: Date!
    updatedAt: Date!

    business: Business

    authorization: Authorization
  }

`];

export const resolvers = {

  User: objectAssign(
    {
      roles(user) {
        return user.get('roles') || [];
      },
      email: parseGraphqlScalarFields(['mail']).mail,
      authorization(user) {
        const authorization_date = user.get('authorization_date');
        const authorization_user = user.get('authorization_user');

        if (authorization_date && authorization_user) {
          return {
            date : authorization_date,
            user : authorization_user,
          }
        }
        return null;
      },
    },
    parseGraphqlObjectFields([
      'business',
    ]),
    parseGraphqlScalarFields([
      'id',
      'displayName',
      'username',
      'sessionToken',
      'emailVerified',
      'createdAt',
      'updatedAt',
    ])
  ),

  AuthorizeManagerResponse : objectAssign(
    {
    },
    parseGraphqlObjectFields([
      'user',
      'error',
    ]),
    parseGraphqlScalarFields([
      'activities',
    ])
  ),

  ChangeEmailResponse : objectAssign(
    {
    },
    parseGraphqlObjectFields([
      'user',
    ]),
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  SetPasswordResponse : objectAssign(
    {
    },
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  UpdateAccountSettingsResponse : objectAssign(
    {
    },
    parseGraphqlObjectFields([
      'user',
    ]),
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  CreateUserResponse : objectAssign(
    {
    },
    parseGraphqlObjectFields([
      'user',
    ]),
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  PasswordResetResponse : objectAssign(
    {
    },
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  ResendEmailVerificationResponse : objectAssign(
    {
    },
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  LogInResponse : objectAssign(
    {
    },
    parseGraphqlObjectFields([
      'user',
    ]),
    parseGraphqlScalarFields([
      'error',
    ])
  ),

  LogOutResponse : objectAssign(
    {
    },
    parseGraphqlScalarFields([
      'error',
    ])
  ),

  Mutation: {
    async authorizeManager(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      if (!userVerified(context.user)) {
        return { activities : [], error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED } };
      }

      if (!userHasRoleAll(context.user, Role_ADMINISTRATORS)) {
        return { activities : [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
      }

      async function isManager(id) {
        const user = await context.Users.get(id);
        if (user) {
          return userHasRoleAll(user, Role_MANAGERS);
        }
        return false;
      }

      if (! (await isManager(id)) || isAuthorized(await context.Users.get(id))) {
        return { activities : [], error: { code: codes.ERROR_ILLEGAL_OPERATION } };
      }

      try {
        const { user, activities } = await context.Users.authorizeManager(id);
        return { user, activities };
      } catch (e) {
        return { activities : [], error: { code: e.code } };
      }
    },
    async revokeManagerAuthorization(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      if (!userVerified(context.user)) {
        return { activities : [], error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED } };
      }

      if (!userHasRoleAll(context.user, Role_ADMINISTRATORS)) {
        return { activities : [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
      }

      async function isManager(id) {
        const user = await context.Users.get(id);
        if (user) {
          return userHasRoleAll(user, Role_MANAGERS);
        }
        return false;
      }

      if (! (await isManager(id)) || isAuthorized(await context.Users.get(id))) {
        return { activities : [], error: { code: codes.ERROR_ILLEGAL_OPERATION } };
      }

      try {
        const { user, activities } = await context.Users.revokeManagerAuthorization(id);
        return { user, activities };
      } catch (e) {
        return { activities : [], error: { code: e.code } };
      }
    },
    async updateAccountSettings(_, { payload }, context) {
      try {
        await accountSettingsValidations.asyncValidate(fromJS(payload));
      } catch (errors) {
        return { errors };
      }
      const user = await context.Users.updateAccountSettings(payload);
      return { user, errors: {} };
    },
    async changeEmail(_, { payload }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }
      try {
        await emailValidations.asyncValidate(fromJS({ ...payload, user: context.user }));
      } catch (errors) {
        return { errors };
      }
      const user = await context.Users.changeEmail(payload);
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
      return await new Promise((resolve, reject) => {
        config.recaptcha.checkResponse(info.recaptcha, async function (error, response) {
          if (error) {
            // an internal error?
            reject({
              errors : {
                recaptcha : { equalTo : true },
              },
            });
            return;
          }
          if (response.success) {
            // save session.. create user.. save form data.. render page, return json.. etc.
            const user = await context.Users.signUp({ ...info, mail : info.email, locale: context.locale });
            resolve({ user, errors: {} });
          } else {
            // show warning, render page, return a json, etc.
            reject({
              errors : {
                recaptcha : { equalTo : true },
              },
            });
          }
        });
      });
    },
    async passwordReset(_, { info }, context) {
      try {
        await passwordResetValidations.asyncValidate(fromJS(info));
      } catch (errors) {
        return { errors };
      }
      await context.Users.passwordReset(info);
      return { errors: {} };
    },
    async resendEmailVerification(_, {}, context) {
      await context.Users.resendEmailVerification();
      return { errors: {} };
    },

    // auth
    async logIn(_, { username, password }, context) {
      try {
        const user = await context.Users.logIn(username, password);
        return { user };
      } catch (e) {
        return { error: { code: e.code } };
      }
    },
    async logOut(_, {}, context) {
      try {
        await context.Users.logOut();
        return {};
      } catch (e) {
        switch (e.code) {
          case Parse.Error.INVALID_SESSION_TOKEN:
            log.error('INVALID_SESSION_TOKEN: clearing storage.');
            Parse.CoreManager.getStorageController().clear();
          default:
            log.error(e);
        }
        return { error: { code: e.code } };
      }
    },
  },

  Query: {
    getUser(_, { id }, context) {
      return context.Users.get(id);
    },
    getUsersByDisplayNameAndEmail(_, { type, displayName, email }, context) {
      return context.Users.getUsersByDisplayNameAndEmail({ type, displayName, email });
    },
    searchUsersByDisplayNameAndEmail(_, { type, displayName, email }, context) {
      return context.Users.searchUsersByDisplayNameAndEmail({ type, displayName, email });
    }
  },

};

