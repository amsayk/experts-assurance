import Parse from 'parse/node';

import {
  SET_PASSWORD,
  UPDATE_ACCOUNT_SETTINGS,
  RESEND_EMAIL_VERIFICATION,
  PASSWORD_RESET,
  SIGN_UP,
  CHANGE_EMAIL,

  AUTHORIZE_MANAGER,
} from 'backend/constants';

export class Users {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
  }

  setPassword(payload) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SET_PASSWORD, args: { payload } },
      { sessionToken: this.user.getSessionToken() }
    );
  }
  changeEmail(payload) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: CHANGE_EMAIL, args: { payload } },
      { sessionToken: this.user.getSessionToken() }
    );
  }
  updateAccountSettings(payload) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: UPDATE_ACCOUNT_SETTINGS, args: { payload } },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  authorizeManager(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: AUTHORIZE_MANAGER, args: { id } }
    );
  }

  signUp(info) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SIGN_UP, args: info }
    );
  }

  passwordReset(info) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: PASSWORD_RESET, args: info }
    );
  }

  resendEmailVerification() {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: RESEND_EMAIL_VERIFICATION, args: {} },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  get(id) {
    return this.connector.get(id);
  }

  logIn(username, password) {
    return this.connector.logIn(username, password);
  }

  logOut() {
    return this.connector.logOut();
  }

}

