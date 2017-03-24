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

  pendingDashboard(durationInDays, now) {
    return this.connector.pendingDashboard(durationInDays, this.user, now);
  }
  openDashboard(durationInDays, now) {
    return this.connector.openDashboard(durationInDays, this.user, now);
  }
  closedDashboard(durationInDays, now) {
    return this.connector.closedDashboard(durationInDays, this.user, now);
  }

  recent() {
    return this.connector.recentDocs(this.user);
  }

  dashboard(selectionSet) {
    return this.connector.dashboard(this.user, selectionSet);
  }
}

