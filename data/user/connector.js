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
      .matchesQuery('business', businessQuery())
      .containedIn('objectId', ids)
      .include([
        'business',
      ])
      .find({ useMasterKey: true });

    return ids.map((id) => {
      const index = users.findIndex((user) => user.id === id);
      return index !== -1 ? users[index] : new Error(`User ${id} not found`);
    });
  }

  get(id) {
    return this.loader.load(id);
  }

  // auth
  logIn(username, password) {
    return Parse.User.logIn(username, password);
  }
  logOut() {
    return Parse.User.logOut();
  }

  getUsersByDisplayNameAndEmail({ type, displayName, email }, user) {
    if (!user) {
      return Promise.resolve([]);
    }

    return getQuery().find({ useMasterKey : true });

    function getQuery() {
      let q = new Parse.Query(Parse.User);

      if (email) {
        q = Parse.Query.or.apply(Parse.Query, [
          q.equalTo('email', email),
          new Parse.Query(Parse.User).equalTo('mail', email)
        ]);
      }

      // Match current business
      q.matchesQuery('business', businessQuery());

      if (displayName) {
        q.equalTo('displayName', displayName);
      }

      q.descending(
        'displayName',
        'email',
        'mail',
      );

      return q;
    }
  }

  searchUsersByDisplayNameAndEmail({ type, displayName, email }, user) {
    if (!user) {
      return Promise.resolve([]);
    }

    return getQuery().find({ useMasterKey : true });

    function getQuery() {
      let q = new Parse.Query(Parse.User);

      if (email) {
        q = Parse.Query.or.apply(Parse.Query, [
          q.matches('email', new RegExp(`^${email}.*`, 'i')),
          new Parse.Query(Parse.User).matches('mail', new RegExp(`^${email}.*`, 'i')),
        ]);
      }

      // Match current business
      q.matchesQuery('business', businessQuery());

      if (displayName) {
        q.matches('displayName', new RegExp(`^${displayName}.*`, 'i'));
      }

      q.descending(
        'displayName',
        'email',
        'mail',
      );

      q.limit(7);

      return q;
    }
  }

}

