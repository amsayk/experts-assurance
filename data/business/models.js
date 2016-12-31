import Parse from 'parse/node';

import {
  UPDATE_USER_BUSINESS,
} from 'backend/constants';

export class Business {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
  }
  updateUserBusiness(userId, payload) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: UPDATE_USER_BUSINESS, args: { userId, payload } }
    );
  }
  get(id) {
    return this.connector.get(id);
  }

  getForUser(userId) {
    return this.connector.getForUser(userId);
  }
}

