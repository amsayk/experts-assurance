import DataLoader from 'dataloader';

import { businessQuery } from 'data/utils';

import Parse from 'parse/node';

export class UserConnector {
  constructor() {
    this.loader = new DataLoader(this.fetch.bind(this), {
    });
  }
  async fetch(ids) {
    const users = await new Parse.Query(Parse.User)
    .matchesQuery('business', businessQuery)
      .containedIn('objectId', ids)
      .find({ useMasterKey: true });

    return ids.map((id) => {
      const index = users.findIndex((user) => user.id === id);
      return index !== -1 ? users[index] : new Error(`User ${id} not found`);
    })
  }

  get(id) {
    return this.loader.load(id);
  }

}

