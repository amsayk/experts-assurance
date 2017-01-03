import Parse from 'parse/node';

import {
  SET_PASSWORD,
  UPDATE_ACCOUNT_SETTINGS,
  RESEND_EMAIL_VERIFICATION,
  PASSWORD_RESET,
  SIGN_UP,
  CHANGE_EMAIL,
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

  resendEmailVerification(info) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: RESEND_EMAIL_VERIFICATION, args: info },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  get(id) {
    return this.connector.get(id);
  }
}

