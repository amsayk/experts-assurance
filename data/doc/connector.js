import DataLoader from 'dataloader';

import Parse from 'parse/node';

import es from 'backend/es';

import {
  userHasRoleAny,
  Role_ADMINISTRATORS,
  Role_AGENTS,
  Role_CLIENTS,
  Role_INSURERS,
} from 'roles';

import { businessQuery } from 'data/utils';

import { DocType } from 'data/types';

import { SORT_DIRECTION_ASC } from 'redux/reducers/sorting/constants';

const LIMIT_PER_PAGE = 45;
const LIMIT_PER_NEXT_PAGE = 15;
const SEARCH_LIMIT = 15;
const RECENT_DOCS_LIMIT = 5;

export class DocConnector {
  constructor() {
    this.loader = new DataLoader(this.fetch.bind(this), {
    });
    this.countByStateLoader = new DataLoader(this.countByState.bind(this), {
    });
  }
  async fetch(ids) {
    const docs = await new Parse.Query(DocType)
      .containedIn('objectId', ids)
      .matchesQuery('business', businessQuery)
      .include([
        'agent',
        'client',
        'user',
        'insurer',
      ])
      .find({ useMasterKey: true });

    return ids.map((id) => {
      const index = docs.findIndex((doc) => doc.id === id);
      return index !== -1 ? docs[index] : new Error(`Doc ${id} not found`);
    })
  }
  async countByState(states) {
    const counts = await Promise.all(states.map(async (s) => {
      try {
        return await new Parse.Query(DocType)
          .equalTo('state', s.toUpperCase())
          .matchesQuery('business', businessQuery)
          .count({ useMasterKey: true })
      } catch (e) {
        return e;
      }
    }));

    return states.map((s, index) => {
      const count = counts[index];
      return typeof count !== 'undefined' && Number.isFinite(count)
        ? count
        : new Error(`Docs count for state \`${s}\` failed`);
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

      q.include([
        'business',
      ]);

      return q.find({ useMasterKey: true });
    }
  }

  esQueryDocs({
    cursor = 0,

    q = null,

    state = null,

    agent = null,
    client = null,
    insurer = null,

    lastModified = null,

    range = null,
    validationRange = null,
    closureRange = null,

    validator = null,
    closer = null,
    user = null,

    sortConfig = null,
  }) {

    const must = [];

    if (state !== null) {
      must.push({
        term: { state },
      });
    }

    if (agent) {
      if (agent.id) {
        must.push({
          term: { 'agent.id': agent.id },
        });
      }
    }

    if (client) {
      if (client.id) {
        must.push({
          term: { 'client.id': client.id },
        });
      }
    }

    if (insurer) {
      if (insurer.id) {
        must.push({
          term: { 'insurer.id': insurer.id },
        });
      }
    }

    if (agent) {
      if (agent.id) {
        must.push({
          term: { 'agent.id': agent.id },
        });
      }
    }

    if (range) {
      if (range.from || range.to) {
        const date = {};

        if (range.from) {
          date.gte = range.from;
        }
        if (range.to) {
          date.lte = range.to;
        }
        must.push({
          range : {
            date,
          }
        });
      }
    }

    if (validationRange && (state !== 'PENDING')) {
      if (validationRange.from || validationRange.to) {
        const range = {};

        if (validationRange.from) {
          range.gte = validationRange.from;
        }
        if (validationRange.to) {
          range.lte = validationRange.to;
        }
        must.push({
          range : {
            'validation_date' : range,
          },
        });
      }
    }

    if (closureRange && (state === 'CLOSED' || state === 'CANCELED')) {
      if (closureRange.from || closureRange.to) {
        const range = {};

        if (closureRange.from) {
          range.gte = closureRange.from;
        }
        if (closureRange.to) {
          range.lte = closureRange.to;
        }
        must.push({
          range : {
            'closure_date' : range,
          },
        });
      }
    }

    if (validator && validator.id) {
      must.push({
        term : { 'validation_user.id' : validator.id },
      });
    }

    if (closer && closer.id) {
      must.push({
        term : { 'closure_user.id' : closer.id },
      });
    }

    if (user && user.id) {
      must.push({
        term : { 'user.id' : user.id },
      });
    }

    if (lastModified) {
      must.push({
        range: {
          lastModified: {
            gte : lastModified,
          },
        },
      });
    }

    const filter = must.length ? {
      bool: {
        must,
      },
    } : undefined;

    const multi_match = q ? {
      operator: 'and',
      fields: [
        'agent.name',
        // 'agent.email',

        'client.name',
        // 'client.email',

        'insurer.name',
        // 'insurer.email',

        'vehicle.model',
        'vehicle.plateNumber',

        'refNo_string',
      ],
      query: q,
    } : undefined;

    const query = filter || multi_match ? {
      bool: {
        must: {
          multi_match,
        },
        filter,
      },

    } : { match_all : {} };

    const sort = [
      '_score',
      {
        lastModified: {
          order: 'desc',
        },
      },
    ];

    const SORT_DIRECTION_MAP = {
      SORT_DIRECTION_ASC : 'asc',
      SORT_DIRECTION_DESC : 'desc',
    };

    if (sortConfig && sortConfig.key) {
      sort.unshift({
        [`${sortConfig.key}`] : { order: sortConfig.direction ? SORT_DIRECTION_MAP[sortConfig.direction] : 'desc' },
      });
    }

    const searchParams = {
      index: 'fikrat',
      type: 'doc',
      from : cursor,
      size: cursor === 0 ? LIMIT_PER_PAGE : LIMIT_PER_NEXT_PAGE,
      body: {
        sort,
        query,
        highlight: {
          'pre_tags'  : ['<mark class=\'hit\'>'],
          'post_tags' : ['</mark>'],
          fields      : {
            'agent.name'          : {},
            // 'agent.email'         : {},

            'insurer.name'        : {},
            // 'insurer.email'       : {},

            'vehicle.model'       : {},
            'vehicle.plateNumber' : {},

            'client.name'         : {},
            // 'client.email'        : {},

            'refNo_string'        : {},
          },
        },
      },
    };

    return es.search(searchParams).then(({ took, hits }) => ({
      took      : took,
      length    : hits.total,
      max_score : hits.max_score,
      hits      : hits.hits,
      cursor    : cursor + hits.hits.length,
    }));

  }

  esSearchDocs(queryString, state = null) {
    if (queryString) {

      const must = [];

      if (state !== null) {
        must.push({
          term: { state },
        });
      }

      const filter = must.length ? {
        bool: {
          must,
        },
      } : undefined;

      const multi_match = {
        operator: 'and',
        fields: [
          'agent.name',
          // 'agent.email',

          'client.name',
          // 'client.email',

          'insurer.name',
          // 'insurer.email',

          'vehicle.model',
          'vehicle.plateNumber',

          'user.name',
          'user.email',

          'refNo_string',

          'validation_user.name',
          // 'validation_user.email',

          'closure_user.name',
          // 'closure_user.email',
        ],
        query: queryString,
      };

      const query = {
        bool: {
          must: {
            multi_match,
          },
          filter,
        },
      };

      const searchParams = {
        index: 'fikrat',
        type: 'doc',
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
          query,
          highlight: {
            'pre_tags'  : ['<mark class=\'hit\'>'],
            'post_tags' : ['</mark>'],
            fields      : {
              'agent.name'                   : {},
              // 'agent.email'                  : {},

              'user.name'                    : {},
              // 'user.email'                   : {},

              'insurer.name'                 : {},
              // 'insurer.email'                : {},

              'vehicle.model'                : {},
              'vehicle.plateNumber'          : {},

              'client.name'                  : {},
              // 'client.email'                 : {},

              'refNo_string'                 : {},

              'validation_user.name'         : {},
              // 'validation_user.email'        : {},

              'closure_user.name'            : {},
              // 'closure_user.email'           : {},
            },
          },
        },
      };

      return es.search(searchParams).then(({ took, hits }) => ({
        took      : took,
        length    : hits.total,
        max_score : hits.max_score,
        hits      : hits.hits,
        cursor    : hits.hits.length,
      }));
    }

    return {
      took      : 0,
      max_score : 0,
      hits      : [],
      cursor    : 0,
      length    : 0,
    };
  }

  esSearchUsersByRoles(queryString, roles) {
    if (queryString) {
      const must = [];

      const type = getType(roles);

      if (roles.indexOf(Role_ADMINISTRATORS) !== -1) {
        must.push({
          term: { isAdmin: true },
        });
      }

      if (type !== null) {
        must.push({
          term: { type },
        });
      }

      const filter = must.length ? {
        bool: {
          must,
        },
      } : undefined;

      const multi_match = queryString ? {
        operator: 'or',
        fields: [
          'name',
          'email',
        ],
        query: queryString,
      } : undefined;

      const query = {
        bool: {
          must: {
            multi_match,
          },
          filter,
        },
      };

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
          query,
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

    function getType(roles) {

      if (userHasRoleAny({ roles }, Role_ADMINISTRATORS, Role_AGENTS)) {
        return 'EMPLOYEE';
      }

      if (userHasRoleAny({ roles }, Role_CLIENTS)) {
        return 'CLIENT';
      }

      if (userHasRoleAny({ roles }, Role_INSURERS)) {
        return 'INSURER';
      }

      return null;
    }
  }

  getDocs(queryString, cursor = 0, sortConfig, client, agent, state, user, topLevelFields) {
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

      if (agent) {
        q.equalTo('agent', Parse.User.createWithoutData(agent));
      }

      if (state) {
        q.equalTo('state', state);
      }
      return q;
    }

    function count() {
      if (topLevelFields.indexOf('length') !== -1) {
        return getQuery().count();
      }
      return Promise.resolve(0);
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

      q.include([
        'agent',
        'client',
        'user',
        'insurer',
      ]);

      return q.find({ useMasterKey: true });
    }

  }

  pendingDashboard(durationInDays, cursor, sortConfig, user, now, selectionSet) {
    if (!user) {
      return Promise.resolve({
        length: 0,
        docs: [],
        cursor: 0,
      });
    }

    return Promise.all([doFetch(), doCount()]).then(([ docs, length ]) => ({
      length,
      docs,
      cursor: cursor + docs.length,
    }));

    function getQuery() {
      const q = new Parse.Query(DocType)
        .equalTo('state', 'PENDING')
        .matchesQuery('business', businessQuery);

      if (durationInDays === -1) {
        q.greaterThanOrEqualTo('date', new Date(now - (3 * 365 * 24 * 60 * 60 * 1000)));
      } else {
        q.greaterThanOrEqualTo('date', new Date(now - (durationInDays * 24 * 60 * 60 * 1000)))
      }

      return q;
    }

    function doFetch() {
      const q = getQuery()
        .limit(cursor > 0 ? LIMIT_PER_NEXT_PAGE : LIMIT_PER_PAGE)
        .include([
          'user',
          'agent',
          'client',
          'insurer',
        ])

      if (cursor) {
        q.skip(cursor);
      }

      q[sortConfig.direction === SORT_DIRECTION_ASC ? 'ascending' : 'descending'](
        !sortConfig.key || sortConfig.key === 'date' ? 'date' : sortConfig.key
      );

      return q.find({ useMasterKey : true });
    }

    function doCount() {
      if (selectionSet.indexOf('length') !== -1){
        return getQuery().count();
      }

      return Promise.resolve(0);
    }

    // if (!user) {
    //   return Promise.resolve([]);
    // }

    // return new Parse.Query(DocType)
    //   .equalTo('state', 'PENDING')
    //   .greaterThanOrEqualTo('createdAt', new Date(now - (durationInDays * 24 * 60 * 60 * 1000)))
    //   .matchesQuery('business', businessQuery)
    //   .include([
    //     'user',
    //     'agent',
    //     'client',
    //     'insurer',
    //   ])
    // .find({ useMasterKey : true });

  }
  openDashboard(durationInDays, cursor, sortConfig, user, now, selectionSet) {
    if (!user) {
      return Promise.resolve({
        length: 0,
        docs: [],
        cursor: 0,
      });
    }

    return Promise.all([doFetch(), doCount()]).then(([ docs, length ]) => ({
      length,
      docs,
      cursor: cursor + docs.length,
    }));

    function getQuery() {
      const q = new Parse.Query(DocType)
        .equalTo('state', 'OPEN')
        .matchesQuery('business', businessQuery);

      if (durationInDays === -1) {
        q.greaterThanOrEqualTo('validation_date', new Date(now - (3 * 365 * 24 * 60 * 60 * 1000)));
      } else {
        q.greaterThanOrEqualTo('validation_date', new Date(now - (durationInDays * 24 * 60 * 60 * 1000)))
      }

      return q;
    }

    function doFetch() {
      const q = getQuery()
        .limit(cursor > 0 ? LIMIT_PER_NEXT_PAGE : LIMIT_PER_PAGE)
        .include([
          'validation_user',
          'agent',
          'client',
          'insurer',
        ])

      if (cursor) {
        q.skip(cursor);
      }

      q[sortConfig.direction === SORT_DIRECTION_ASC ? 'ascending' : 'descending'](
        !sortConfig.key || sortConfig.key === 'date' ? 'date' : sortConfig.key
      );

      return q.find({ useMasterKey : true });
    }

    function doCount() {
      if (selectionSet.indexOf('length') !== -1){
        return getQuery().count();
      }

      return Promise.resolve(0);
    }

  }
  closedDashboard(durationInDays, cursor, sortConfig, user, now, selectionSet, includeCanceled) {
    if (!user) {
      return Promise.resolve({
        length: 0,
        docs: [],
        cursor: 0,
      });
    }

    return Promise.all([doFetch(), doCount()]).then(([ docs, length ]) => ({
      length,
      docs,
      cursor: cursor + docs.length,
    }));

    function getQuery() {
      let q = new Parse.Query(DocType).equalTo('state', 'CLOSED');

      if (includeCanceled) {
        q = [
          q,
          new Parse.Query(DocType).equalTo('state', 'CANCELED'),
        ];
      }

      q = (Array.isArray(q) ? Parse.Query.or.apply(Parse.Query, q) : q)
        .matchesQuery('business', businessQuery);

      if (durationInDays === -1) {
        q.greaterThanOrEqualTo('closure_date', new Date(now - (3 * 365 * 24 * 60 * 60 * 1000)));
      } else {
        q.greaterThanOrEqualTo('closure_date', new Date(now - (durationInDays * 24 * 60 * 60 * 1000)));
      }

      return q;
    }

    function doFetch() {
      const q = getQuery()
        .limit(cursor > 0 ? LIMIT_PER_NEXT_PAGE : LIMIT_PER_PAGE)
        .include([
          'closure_user',
          'agent',
          'client',
          'insurer',
        ]);

      if (cursor) {
        q.skip(cursor);
      }

      q[sortConfig.direction === SORT_DIRECTION_ASC ? 'ascending' : 'descending'](
        !sortConfig.key || sortConfig.key === 'date' ? 'date' : sortConfig.key
      );

      return q.find({ useMasterKey : true });
    }

    function doCount() {
      if (selectionSet.indexOf('length') !== -1){
        return getQuery().count();
      }

      return Promise.resolve(0);
    }
    // if (!user) {
    //   return Promise.resolve([]);
    // }
    //
    // const queries = [
    //   new Parse.Query(DocType).equalTo('state', 'CLOSED'),
    //   new Parse.Query(DocType).equalTo('state', 'CANCELED'),
    // ];
    //
    // return Parse.Query.or.apply(Parse.Query, queries)
    //   .greaterThanOrEqualTo('closure_date', new Date(now - (durationInDays * 24 * 60 * 60 * 1000)))
    //   .matchesQuery('business', businessQuery)
    //   .include([
    //     'closure_user',
    //     'agent',
    //     'client',
    //     'insurer',
    //   ])
    //   .find({ useMasterKey : true });

    // return docs.filter((doc) => {
    //   const dtClosure = new Date(doc.get('closure').date);
    //   return now - dtClosure.getTime() >= (durationInDays * 24 * 60 * 60 * 1000);
    // });
  }

  recentDocs(user) {
    if (!user) {
      return Promise.resolve([]);
    }

    return new Parse.Query(DocType)
      .descending('date')
      .limit(RECENT_DOCS_LIMIT)
      .include([
        'user',
      ])
      .find();
  }

  async dashboard(user, selectionSet) {
    if (!user) {
      return {
        pending  : { count: 0 },
        open     : { count: 0 },
        closed   : { count: 0 },
        canceled : { count: 0 },
      };
    }

    const results = await Promise.all(selectionSet.map((state) => this.countByStateLoader.load(state)));

    return selectionSet.reduce((memo, state, index) => {
      memo[state] = { count: results[index] };
      return memo;
    }, {});
  }
}

