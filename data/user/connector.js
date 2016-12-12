import DataLoader from 'dataloader';

import Parse from 'parse/node';

export class UserConnector {
  constructor() {
    this.loader = new DataLoader(this.fetch.bind(this), {
    });
  }
  fetch(ids) {
    return Promise.all(ids.map((id) => {
      return new Parse.Query(Parse.User).get(id, { useMasterKey: true });
    }));
  }

  get(id) {
    return this.loader.load(id);
  }
}

