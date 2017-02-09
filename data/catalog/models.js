import Parse from 'parse/node';

import {
  ADD_PRODUCT,
} from 'backend/constants';

import * as fixtures from './fixtures/data';

export class Products {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
  }

  add(info) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: ADD_PRODUCT, args: info }
    );
  }

  fetchAll(query) {
    return fixtures.getAll(query);
  }

  recent(query) {
    return fixtures.recent(query);
  }

  labels() {
    return fixtures.getAllLabels();
  }

  get(id) {
    return fixtures.get(id);
    // return this.connector.get(id);
  }
}

