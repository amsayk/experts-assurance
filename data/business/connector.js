import DataLoader from 'dataloader';

import Parse from 'parse/node';

import {
  BusinessType,
} from 'data/types';

const log = require('log')('app:backend:business');

export class BusinessConnector {
  constructor() {
    this.loader = new DataLoader(fetch, {
    });
    this.forUserLoader = new DataLoader(fetchForUser, {
    });
  }
  get(id) {
    return this.loader.load(id);
  }
  getForUser(userId) {
    return this.forUserLoader.load(userId);
  }

}

function fetch(ids) {
  return Promise.all(ids.map((id) => {
    return new Parse.Query(BusinessType).get(id, { useMasterKey: true });
  }));
}

function fetchForUser(ids) {
  return Promise.all(ids.map((id) => {
    try {
      return new Parse.Query(BusinessType)
        .equalTo('user', Parse.User.createWithoutData(id))
        .first({ useMasterKey: true });
    } catch (e) {
      log.error(e);
      return null;
    }
  }));
}

