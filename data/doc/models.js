import Parse from 'parse/node';

import {

} from 'backend/constants';

export class Docs {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
  }

  get(id) {
    return this.connector.get(id);
  }

  getDocs({ queryString, cursor = 0, sortConfig, client, agent, state }, topLevelFields) {
    return this.connector.getDocs(queryString, cursor, sortConfig, client, agent, state, this.user, topLevelFields);
  }

  searchUsersByRoles(queryString, roles) {
    return this.connector.searchUsersByRoles(queryString, roles);
  }

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
  openDashboard(durationInDays, cursor, sortConfig, selectionSet, now) {
    return this.connector.openDashboard(
      durationInDays,
      cursor,
      sortConfig,
      this.user,
      now,
      selectionSet,
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
}

