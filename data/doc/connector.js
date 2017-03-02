import DataLoader from 'dataloader';

import Parse from 'parse/node';

import { businessQuery } from 'data/utils';

import { DocType } from 'data/types';

import { SORT_DIRECTION_ASC } from 'redux/reducers/sorting/constants';

const LIMIT_PER_PAGE = 45;
const LIMIT_PER_NEXT_PAGE = 15;
const SEARCH_LIMIT = 15;

export class DocConnector {
  constructor() {
    this.loader = new DataLoader(this.fetch.bind(this), {
    });
  }
  async fetch(ids) {
    const activities = await new Parse.Query(DocType)
      .containedIn('objectId', ids)
      .matchesQuery('business', businessQuery)
      .find({ useMasterKey: true });

    return ids.map((id) => {
      const index = activities.findIndex((doc) => doc.id === id);
      return index !== -1 ? activities[index] : new Error(`Doc ${id} not found`);
    })
  }

  get(id) {
    return this.loader.load(id);
  }

  searchUsersByRoles(queryString, roles) {
    return queryString
      ? doFetch()
      : Promise.resolve([]);

    function getQuery(role) {
      const queries = [
        new Parse.Query(Parse.User).matches('displayName', `.*${queryString}.*`),
        new Parse.Query(Parse.User).matches('email', `.*${queryString}.*`),
      ];

      const q = Parse.Query.or.apply(Parse.Query, queries);

      if (role) {
        q.equalTo('roles', role);
      }

      return q;
    }

    function doFetch() {
      const q = (roles.length > 1
        ?  Parse.Query.or.apply(Parse.Query, roles.map(getQuery))
        : getQuery(roles[0]))
        .ascending('displayName')
        .ascending('email')
        .matchesQuery('business', businessQuery)
        .limit(SEARCH_LIMIT);

      return q.find({ useMasterKey: true });
    }
  }

  getDocs(queryString, cursor = 0, sortConfig, client, insurer, state, user) {
    return Promise.all([count(), doFetch()]).then(([ length, docs ]) => ({
      cursor: cursor + docs.length,
      length,
      docs,
    }));

    function getQuery() {
      const q = new Parse.Query(DocType)
        .matchesQuery('business', businessQuery)

      if (client) {
        q.equalTo('client', Parse.User.createWithoutData(client));
      }

      if (insurer) {
        q.equalTo('insurer', Parse.User.createWithoutData(insurer));
      }

      if (state) {
        q.equalTo('state', state);
      }
      return q;
    }

    function count() {
      return getQuery().count();
    }

    function doFetch() {
      const q = getQuery()
        .limit(cursor > 0 ? LIMIT_PER_NEXT_PAGE : LIMIT_PER_PAGE);


      q[sortConfig.direction === SORT_DIRECTION_ASC ? 'ascending' : 'descending'](
        !sortConfig.key || sortConfig.key === 'date' ? 'date' : sortConfig.key
      );

      if (cursor) {
        q.skip(cursor);
      }
      return q.find({ useMasterKey: true });
    }

  }
}

