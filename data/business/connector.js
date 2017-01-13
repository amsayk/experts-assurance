import DataLoader from 'dataloader';

import Parse from 'parse/node';

import {
  BusinessType,
} from 'data/types';

export class BusinessConnector {
  constructor() {
    this.loader = new DataLoader(fetch, {
    });
  }
  get(id) {
    return this.loader.load(id);
  }

}

function fetch(ids) {
  return Promise.all(ids.map((id) => {
    return new Parse.Query(BusinessType).get(id, { useMasterKey: true });
  }));
}

