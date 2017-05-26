import Parse from 'parse/node';

import {
  UPDATE_USER_BUSINESS,
} from 'backend/constants';

import { getRefNo } from 'backend/utils';

export class Business {
  constructor({ connector, user }) {
    this.connector = connector;
    this.user = user;
  }
  updateUserBusiness(payload) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: UPDATE_USER_BUSINESS, args: { payload } },
      { sessionToken: this.user.getSessionToken() },
    );
  }
  get(id) {
    return this.connector.get(id);
  }

  getUsers({ roles, queryString, cursor, sortConfig }, topLevelFields) {
    return this.connector.getUsers(roles, queryString, cursor, sortConfig, this.user, topLevelFields);
  }
  // searchUsers(q) {
  //   return this.connector.searchUsers(q, this.user);
  // }

  esSearchUsers(q) {
    return this.connector.esSearchUsers(q, this.user);
  }

  async getLastRefNo(now) {
    return { value : await getRefNo(now) };
  }

}

