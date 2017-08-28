import DataLoader from 'dataloader';

import Parse from 'parse/node';

import { businessQuery } from 'data/utils';

import { ActivityType, DocType } from 'data/types';

import { DOC_FOREIGN_KEY } from 'backend/constants';

const LIMIT_PER_PAGE = 15;

export class ActivityConnector {
  constructor() {
    this.loader = new DataLoader(this.fetch.bind(this), {});
  }
  async fetch(ids) {
    const activities = await new Parse.Query(ActivityType)
      .matchesQuery('business', businessQuery())
      .containedIn('objectId', ids)
      .include(['document', 'user', 'file', 'importation'])
      .find({ useMasterKey: true });

    return ids.map(id => {
      const index = activities.findIndex(activity => activity.id === id);
      return index !== -1
        ? activities[index]
        : new Error(`Activity ${id} not found`);
    });
  }

  get(id, cached) {
    if (cached === false) {
      return new Parse.Query(ActivityType)
        .matchesQuery('business', businessQuery())
        .include(['document', 'user', 'file', 'importation'])
        .get(id, { useMasterKey: true });
    }
    return this.loader.load(id);
  }

  getTimeline({ cursor, query, user }) {
    if (!user) {
      return Promise.resolve({
        prevCursor: 0,
        cursor: 0,
        result: [],
      });
    }

    return doFetch().then(rs => ({
      prevCursor: cursor,
      cursor: rs.length > 0 ? rs[rs.length - 1].get('now') : 0,
      result: rs,
    }));

    function getQuery() {
      const q = new Parse.Query(ActivityType);
      return q;
    }

    function doFetch() {
      const q = getQuery()
        .matchesQuery('business', businessQuery())
        .descending('now')
        .limit(LIMIT_PER_PAGE);

      if (query.doc) {
        q.equalTo(DOC_FOREIGN_KEY, query.doc);
      }

      if (query.ns) {
        q.equalTo('ns', query.ns);
      }

      if (query.types) {
        q.containedIn('type', query.types);
      }

      if (cursor) {
        q.lessThan('now', cursor);
      }

      q.include(['file', 'user', 'document', 'importation']);

      return q.find({ useMasterKey: true });
    }
  }
}
