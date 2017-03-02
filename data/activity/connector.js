import DataLoader from 'dataloader';

import Parse from 'parse/node';

import { businessQuery } from 'data/utils';

import { ActivityType, DocType } from 'data/types';

const LIMIT_PER_PAGE = 15;

export class ActivityConnector {
  constructor() {
    this.loader = new DataLoader(this.fetch.bind(this), {
    });
  }
  async fetch(ids) {
    const activities = await new Parse.Query(ActivityType)
      .matchesQuery('business', businessQuery)
      .containedIn('objectId', ids)
      .find({ useMasterKey: true });

    return ids.map((id) => {
      const index = activities.findIndex((activity) => activity.id === id);
      return index !== -1 ? activities[index] : new Error(`Activity ${id} not found`);
    })
  }

  get(id) {
    return this.loader.load(id);
  }

  getTimeline(cursor, query, user) {
    return doFetch().then((activities) => ({
      prevCursor: cursor,
      cursor: activities.length > 0 ? activities[activities.length - 1].get('timestamp') : null,
      result: activities,
    }));

    function getQuery() {
      const q = new Parse.Query(ActivityType);
      return q;
    }

    function doFetch() {
      const q = getQuery()
        .matchesQuery('business', businessQuery)
        .descending('timestamp')
        .limit(LIMIT_PER_PAGE);

      if (query.doc) {
        q.equalTo('document', DocType.createWithoutData(query.doc));
      }

      if (query.ns) {
        q.equalTo('ns', query.ns);
      }

      if (query.types) {
        q.containedIn('type', query.types);
      }

      if (cursor) {
        q.lessThan('timestamp', cursor);
      }
      return q.find({ useMasterKey: true });
    }

  }
}

