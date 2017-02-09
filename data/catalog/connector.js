import DataLoader from 'dataloader';

import Parse from 'parse/node';

import { ProductType } from 'data/types';

export class ProductConnector {
  constructor() {
    this.loader = new DataLoader(this.fetch.bind(this), {
    });
  }
  fetch(ids) {
    return Promise.all(ids.map((id) => {
      return new Parse.Query(ProductType).get(id, { useMasterKey: true });
    }));
  }

  get(id) {
    return this.loader.load(id);
  }
}

