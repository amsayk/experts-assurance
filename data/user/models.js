import Parse from 'parse/node';

import {
  RESEND_EMAIL_VERIFICATION,
  PASSWORD_RESET,
  SIGN_UP,
} from 'backend/constants';

export class Users {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
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

