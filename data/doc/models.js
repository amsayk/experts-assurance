import Parse from 'parse/node';

import {
  ADD_DOC,
  DELETE_DOC,
  RESTORE_DOC,
  SET_MANAGER,
  SET_STATE,

  // Files
  UPLOAD_FILE,
  DELETE_FILE,
  RESTORE_FILE,
} from 'backend/constants';

export class Docs {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
  }

  get(id) {
    return this.connector.get(id);
  }

  getFile(id) {
    return this.connector.getFile(id);
  }

  getDocFiles(id) {
    return this.connector.getDocFiles(id);
  }

  validateDoc(id) {
    return this.connector.validateDoc(id);
  }

  getDocs({ queryString, cursor = 0, sortConfig, client, manager, state }, topLevelFields) {
    return this.connector.getDocs(queryString, cursor, sortConfig, client, manager, state, this.user, topLevelFields);
  }

  // searchUsersByRoles(queryString, roles) {
  //   return this.connector.searchUsersByRoles(queryString, roles);
  // }

  esSearchUsersByRoles(queryString, roles) {
    return this.connector.esSearchUsersByRoles(queryString, roles);
  }

  esSearchDocs(queryString, state) {
    return this.connector.esSearchDocs(queryString, state);
  }

  esQueryDocs(query) {
    return this.connector.esQueryDocs(query);
  }

  pendingDashboard(durationInDays, cursor, sortConfig, selectionSet, now) {
    return this.connector.pendingDashboard(
      durationInDays,
      cursor,
      sortConfig,
      this.user,
      now,
      selectionSet,
    );
  }
  openDashboard(durationInDays, cursor, sortConfig, selectionSet, validOnly, now) {
    return this.connector.openDashboard(
      durationInDays,
      cursor,
      sortConfig,
      this.user,
      now,
      selectionSet,
      validOnly,
    );
  }
  closedDashboard(durationInDays, cursor, sortConfig, selectionSet, includeCanceled, now) {
    return this.connector.closedDashboard(
      durationInDays,
      cursor,
      sortConfig,
      this.user,
      now,
      selectionSet,
      includeCanceled,
    );
  }

  recent() {
    return this.connector.recentDocs(this.user);
  }

  dashboard(selectionSet) {
    return this.connector.dashboard(this.user, selectionSet);
  }

  // Mutations

  addDoc(payload) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: ADD_DOC, args: { payload } },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  delDoc(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DELETE_DOC, args: { id } },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  restoreDoc(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: RESTORE_DOC, args: { id } },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  setManager(id, manager) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SET_MANAGER, args: { id, manager } },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  setState(id, state) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SET_STATE, args: { id, state } },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  // Files

  uploadFile(payload) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: UPLOAD_FILE, args: { payload } },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  delFile(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DELETE_FILE, args: { id } },
      { sessionToken: this.user.getSessionToken() }
    );
  }

  restoreFile(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: RESTORE_FILE, args: { id } },
      { sessionToken: this.user.getSessionToken() }
    );
  }
}

