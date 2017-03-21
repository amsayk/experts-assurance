import DataLoader from 'dataloader';

import Parse from 'parse/node';

import { businessQuery } from 'data/utils';

import {
  BusinessType,
} from 'data/types';

import es from 'backend/es';

import { SORT_DIRECTION_ASC } from 'redux/reducers/sorting/constants';

const LIMIT_PER_PAGE = 30;
const SEARCH_LIMIT = 15;

export class BusinessConnector {
  constructor() {
    this.loader = new DataLoader(fetch, {
    });
  }
  get(id) {
    return this.loader.load(id);
  }

  getUsers(role, queryString, cursor = 0, sortConfig, user) {
    if (!user) {
      return Promise.resolve({
        cursor : 0,
        length : 0,
        users  : [],
      });
    }

    return Promise.all([count(), doFetch()]).then(([ length, users ]) => ({
      cursor: cursor + users.length,
      length,
      users,
    }));

    function getQuery() {
      const q = new Parse.Query(Parse.User)
        .matchesQuery('business', businessQuery)
        .notEqualTo('objectId', user.id);

      if (!__DEV__) {
        q.equalTo('emailVerified', true);
      }

      q[sortConfig.direction === SORT_DIRECTION_ASC ? 'ascending' : 'descending'](
        !sortConfig.key || sortConfig.key === 'date' ? 'updatedAt' : sortConfig.key
      );

      if (role) {
        q.equalTo('roles', role);
      }

      if (queryString) {
        q.matches('displayName', `.*${queryString}.*`);
      }
      return q;
    }

    function count() {
      return getQuery().count();
    }

    function doFetch() {
      const q = getQuery()
        .limit(LIMIT_PER_PAGE);

      if (cursor) {
        q.skip(cursor);
      }
      return q.find({ useMasterKey: true });
    }

  }
  searchUsers(q, user) {
    return doSearch();

    function doSearch() {
      if (q && user) {
        const qry = new Parse.Query(Parse.User)
          .notEqualTo('objectId', user.id)
          .matchesQuery('business', businessQuery)
          .limit(SEARCH_LIMIT)
          .matches('displayName', `.*${q}.*`);

        if (!__DEV__) {
          qry.equalTo('emailVerified', true);
        }

        qry.descending(
          'updatedAt'
        );

        return qry.find({ useMasterKey: true });
      }

      return Promise.resolve([]);
    }

  }

  esSearchUsers(q) {
    if (q) {
      const searchParams = {
        index: 'fikrat',
        type: 'person',
        size: SEARCH_LIMIT,
        body: {
          sort: [
            '_score',
            {
              lastModified: {
                order: 'desc',
              },
            },
          ],
          query: {
            bool: {
              must: {
                multi_match: {
                  operator: 'or',
                  fields: [
                    'name',
                    'email',
                  ],
                  query: q,
                },
              },
            },
          },
        },
      };

      return es.search(searchParams).then(({ took, hits }) => ({
        took      : took,
        total     : hits.total,
        max_score : hits.max_score,
        hits      : hits.hits,
      }));
    }

    return {
      took      : 0,
      total     : 0,
      max_score : 0,
      hits      : [],
    };
  }
}

async function fetch(ids) {
  const objects = await new Parse.Query(BusinessType)
    .containedIn('objectId', ids)
    .matchesQuery('business', businessQuery)
    .find({ useMasterKey: true });

  return ids.map((id) => {
    const index = objects.findIndex((object) => object.id === id);
    return index !== -1 ? objects[index] : new Error(`Business ${id} not found`);
  });
}

