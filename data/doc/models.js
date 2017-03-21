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

  getDocs({ queryString, cursor = 0, sortConfig, client, agent, state }) {
    return this.connector.getDocs(queryString, cursor, sortConfig, client, agent, state, this.user);
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

}

