import DataLoader from 'dataloader';

import Parse from 'parse/node';

import es from 'backend/es';

import config from 'build/config';

import uniqBy from 'lodash.uniqby';

import {
  userHasRoleAny,
  Role_ADMINISTRATORS,
  Role_MANAGERS,
  Role_CLIENTS,
  Role_AGENTS,
} from 'roles';

import { DOC_ID_KEY, DOC_FOREIGN_KEY } from 'backend/constants';

import { businessQuery } from 'data/utils';

import categories from 'file-categories';

import { DocType, FileType, ObservationType, ImportationType } from 'data/types';

import { SORT_DIRECTION_ASC } from 'redux/reducers/sorting/constants';

const LIMIT_PER_PAGE = 45;
const LIMIT_PER_NEXT_PAGE = 15;
const SEARCH_LIMIT = 7;
const RECENT_DOCS_LIMIT = 5;

export class DocConnector {
  constructor() {
    this.docs = new DataLoader(async function(ids) {
      const docs = await new Parse.Query(DocType)
        .containedIn(DOC_ID_KEY, ids)
        .matchesQuery('business', businessQuery())
        .include([
          'manager',
          'client',
          'agent',
          'user',
          'payment_user',
          'validation_user',
          'closure_user',
        ])
        .find({ useMasterKey: true });

      return ids.map(id => {
        const index = docs.findIndex(doc => doc.get(DOC_ID_KEY) === id);
        return index !== -1 ? docs[index] : new Error(`Doc ${id} not found`);
      });
    }, {});

    this.files = new DataLoader(async function(ids) {
      const files = await new Parse.Query(FileType)
        .containedIn('objectId', ids)
        .matchesQuery('business', businessQuery())
        .include(['fileObj', 'user'])
        .find({ useMasterKey: true });

      return ids.map(id => {
        const index = files.findIndex(file => file.id === id);
        return index !== -1 ? files[index] : new Error(`File ${id} not found`);
      });
    }, {});

    this.counts = new DataLoader(async function(states) {
      const counts = await Promise.all(
        states.map(async s => {
          try {
            return await new Parse.Query(DocType)
              .doesNotExist('deletion_date')
              .doesNotExist('deletion_user')
              .equalTo('state', s.toUpperCase())
              .matchesQuery('business', businessQuery())
              .count({ useMasterKey: true });
          } catch (e) {
            return e;
          }
        }),
      );

      return states.map((s, index) => {
        const count = counts[index];
        return typeof count !== 'undefined' && Number.isFinite(count)
          ? count
          : new Error(`Docs count for state '${s}' failed`);
      });
    }, {});

    this.importations = new DataLoader(async function(ids) {
      const objects = await new Parse.Query(ImportationType)
        .containedIn('objectId', ids)
        .matchesQuery('business', businessQuery())
        .include(['user'])
        .find({ useMasterKey: true });

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1
          ? objects[index]
          : new Error(`Importation ${id} not found`);
      });
    }, {});
  }

  async searchVehicles(q) {
    if (q) {
      const queries = ['manufacturer', 'model', 'plateNumber'].map(key => {
        return new Parse.Query(DocType)
          .matchesQuery('business', businessQuery())
          .doesNotExist('deletion_user')
          .doesNotExist('deletion_date')
          .matches(`vehicle.${key}`, new RegExp(`^${q}.*`, 'i'));
      });

      const query = Parse.Query.or.apply(Parse.Query, queries);

      const docs = await query.find({ useMasterKey: true });

      return uniqBy(
        docs.map(doc => doc.get('vehicle')),
        vehicle => vehicle.manufacturer,
      );
    }

    return [];
  }

  async queryCompanies(q) {
    if (q) {
      const queries = ['company'].map(key => {
        return new Parse.Query(DocType)
          .matchesQuery('business', businessQuery())
          .exists('company')
          .doesNotExist('deletion_user')
          .doesNotExist('deletion_date')
          .matches(`${key}`, new RegExp(`^${q}.*`, 'i'));
      });

      const query = Parse.Query.or.apply(Parse.Query, queries);

      const docs = await query.find({ useMasterKey: true });

      return uniqBy(docs.map(doc => doc.get('company')), company => company);
    }

    return [];
  }

  async vehicleByPlateNumber(plateNumber) {
    const query = new Parse.Query(DocType)
      .matchesQuery('business', businessQuery())
      .doesNotExist('deletion_user')
      .doesNotExist('deletion_date')
      .equalTo(`vehicle.plateNumber`, plateNumber);

    const doc = await query.first({ useMasterKey: true });

    return doc.get('vehicle');
  }

  getImportation(id) {
    return this.importations.load(id);
  }
  ongoingImportation() {
    return new Parse.Query(ImportationType)
      .matchesQuery('business', businessQuery())
      .doesNotExist('endDate')
      .include(['user'])
      .first({ useMasterKey: true });
  }

  get(id) {
    return this.docs.load(id);
  }
  getFile(id) {
    return this.files.load(id);
  }

  getDocFiles(id) {
    return getQuery().find({ useMasterKey: true });

    function getQuery() {
      const q = new Parse.Query(FileType)
        .matchesQuery('business', businessQuery())
        .equalTo(DOC_FOREIGN_KEY, id)
        .doesNotExist('deletion_user')
        .doesNotExist('deletion_date')
        .include(['fileObj', 'user']);

      return q;
    }
  }

  getDocObservations({ cursor, id, user }) {
    if (!user) {
      return Promise.resolve({
        prevCursor: 0,
        cursor: 0,
        items: [],
      });
    }

    return doFetch().then(observations => ({
      prevCursor: cursor,
      cursor:
        observations.length > 0
          ? observations[observations.length - 1].get('date')
          : 0,
      items: observations,
    }));

    function getQuery() {
      const q = new Parse.Query(ObservationType);
      return q;
    }

    function doFetch() {
      const q = getQuery()
        .matchesQuery('business', businessQuery())
        .descending('date')
        .limit(LIMIT_PER_PAGE);

      q.equalTo(DOC_FOREIGN_KEY, id);

      if (cursor) {
        q.lessThan('date', cursor);
      }

      q.include(['user']);

      return q.find({ useMasterKey: true });
    }
  }

  async isDocValid(id) {
    try {
      // const doc = await this.get(id);
      //
      // if (!doc) {
      //   return false;
      // }

      return await categories.reduce(function(p, { slug: category, required }) {
        return p.then(async function(isValid) {
          if (isValid) {
            return required ? await hasCategory(id, category) : true;
          }
          return false;
        });
      }, Promise.resolve(true));
    } catch (e) {
      return false;
    }

    async function hasCategory(id, category) {
      return (
        (await new Parse.Query(FileType)
          .matchesQuery('business', businessQuery())
          .equalTo(DOC_FOREIGN_KEY, id)
          .equalTo('category', category)
          .doesNotExist('deletion_user')
          .doesNotExist('deletion_date')
          .count({ useMasterKey: true })) > 0
      );
    }
  }

  getInvalidDocs({
    category,
    // durationInDays,
    cursor,
    sortConfig,
    selectionSet,
    user,
    now,
    returnAll,
  }) {
    if (!user) {
      return Promise.resolve({
        length: 0,
        docs: [],
        cursor: 0,
      });
    }

    return Promise.all([doFetch(), doCount()]).then(([docs, length]) => ({
      length,
      docs,
      cursor: cursor + docs.length,
    }));

    function getQuery() {
      const queries = [];

      (category
        ? [{ slug: category, required: true }]
        : categories).forEach(({ slug: category, required }) => {
        if (required) {
          const query = new Parse.Query(FileType)
            .matchesQuery('business', businessQuery())
            .doesNotExist('deletion_user')
            .doesNotExist('deletion_date')
            .equalTo('category', category);

          queries.push(
            new Parse.Query(DocType).doesNotMatchKeyInQuery(
              'files',
              'objectId',
              query,
            ),
          );
        }
      });

      const q = (queries.length > 1
        ? Parse.Query.or.apply(Parse.Query, queries)
        : queries[0]).matchesQuery('business', businessQuery());

      // if (durationInDays === -1) {
      //   q.lessThan('validation_date', new Date(now - 94672800000));
      // } else {
      //   q.greaterThanOrEqualTo('validation_date', new Date(now - (durationInDays * 24 * 60 * 60 * 1000)))
      // }

      // Files exists
      q.exists('files');

      q.equalTo('state', 'OPEN');
      q.doesNotExist('validation_date');

      // Not deleted
      q.doesNotExist('deletion_date');
      q.doesNotExist('deletion_user');

      return Parse.Query.or.apply(Parse.Query, [
        // Has no files
        new Parse.Query(DocType)
          .matchesQuery('business', businessQuery())
          .doesNotExist('deletion_user')
          .doesNotExist('deletion_date')
          .doesNotExist('validation_date')
          .equalTo('state', 'OPEN')
          .doesNotExist('files'),

        // files missing categories
        q,
      ]);
    }

    function doFetch() {
      const q = getQuery().include([
        'user',
        'payment_user',
        'validation_user',
        'manager',
        'client',
        'agent',
      ]);

      if (cursor && returnAll === false) {
        q.skip(cursor);
      }

      if (returnAll === false) {
        q.limit(cursor > 0 ? LIMIT_PER_NEXT_PAGE : LIMIT_PER_PAGE);
      }

      q[
        sortConfig.direction === SORT_DIRECTION_ASC ? 'ascending' : 'descending'
      ](
        !sortConfig.key || sortConfig.key === 'dateMission'
          ? 'dateMission'
          : sortConfig.key,
      );

      return q.find({ useMasterKey: true });
    }

    function doCount() {
      if (selectionSet.indexOf('length') !== -1) {
        return getQuery().count({ useMasterKey: true });
      }

      return Promise.resolve(0);
    }
  }
  getUnpaidDocs({
    durationInDays,
    cursor,
    sortConfig,
    selectionSet,
    user,
    now,
    returnAll,
  }) {
    if (!user) {
      return Promise.resolve({
        length: 0,
        docs: [],
        cursor: 0,
      });
    }

    return Promise.all([doFetch(), doCount()]).then(([docs, length]) => ({
      length,
      docs,
      cursor: cursor + docs.length,
    }));

    function getQuery() {
      const q = new Parse.Query(DocType).matchesQuery(
        'business',
        businessQuery(),
      );

      if (durationInDays === -1) {
        q.lessThan('validation_date', new Date(now - 94672800000));
      } else {
        q.greaterThanOrEqualTo(
          'validation_date',
          new Date(now - durationInDays * 24 * 60 * 60 * 1000),
        );
      }

      // Only open docs
      q.equalTo('state', 'OPEN');

      // validated
      q.exists('validation_date');

      // Not deleted
      q.doesNotExist('deletion_date');
      q.doesNotExist('deletion_user');

      // Unpaid
      q.doesNotExist('payment_date');
      q.doesNotExist('payment_user');

      return q;
    }

    function doFetch() {
      const q = getQuery().include([
        'payment_user',
        'validation_user',
        'user',
        'manager',
        'client',
        'agent',
      ]);

      if (cursor && returnAll === false) {
        q.skip(cursor);
      }

      if (returnAll === false) {
        q.limit(cursor > 0 ? LIMIT_PER_NEXT_PAGE : LIMIT_PER_PAGE);
      }

      q[
        sortConfig.direction === SORT_DIRECTION_ASC ? 'ascending' : 'descending'
      ](
        !sortConfig.key || sortConfig.key === 'dateMission'
          ? 'dateMission'
          : sortConfig.key,
      );

      return q.find({ useMasterKey: true });
    }

    function doCount() {
      if (selectionSet.indexOf('length') !== -1) {
        return getQuery().count({ useMasterKey: true });
      }

      return Promise.resolve(0);
    }
  }

  // searchUsersByRoles(queryString, roles) {
  //   return queryString
  //     ? doFetch()
  //     : Promise.resolve([]);
  //
  //   function getQuery(role) {
  //     const queries = [
  //       new Parse.Query(Parse.User).matches('displayName', `.*${queryString}.*`),
  //       new Parse.Query(Parse.User).matches('email', `.*${queryString}.*`),
  //     ];
  //
  //     const q = Parse.Query.or.apply(Parse.Query, queries);
  //
  //     if (role) {
  //       q.equalTo('roles', role);
  //     }
  //
  //     return q;
  //   }
  //
  //   function doFetch() {
  //     const q = (roles.length > 1
  //       ?  Parse.Query.or.apply(Parse.Query, roles.map(getQuery))
  //       : getQuery(roles[0]))
  //       .ascending('displayName')
  //       .ascending('email')
  //       .matchesQuery('business', businessQuery())
  //       .limit(SEARCH_LIMIT);
  //
  //     q.include([
  //       'business',
  //     ]);
  //
  //     return q.find({ useMasterKey: true });
  //   }
  // }

  async esQueryDocs({
    cursor = 0,

    q = null,

    state = null,

    company = null,
    manager = null,
    client = null,
    agent = null,

    vehicleManufacturer = null,
    vehicleModel = null,

    lastModified = null,

    missionRange = null,
    range = null,
    // validationRange = null,
    closureRange = null,

    validator = null,
    closer = null,
    user = null,

    sortConfig = null,

    returnAll = false,
  }) {
    const must = [];

    if (state !== null) {
      must.push({
        term: { state },
      });
    }

    if (vehicleManufacturer !== null) {
      must.push({
        match: { 'vehicle.manufacturer': vehicleManufacturer },
      });
    }

    if (vehicleModel !== null) {
      must.push({
        match: { 'vehicle.model': vehicleModel },
      });
    }

    if (manager) {
      if (manager.id) {
        must.push({
          term: { 'manager.id': manager.id },
        });
      }
    }

    if (company) {
      must.push({
        match: { company },
      });
    }

    if (client) {
      if (client.id) {
        must.push({
          term: { 'client.id': client.id },
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

    if (manager) {
      if (manager.id) {
        must.push({
          term: { 'manager.id': manager.id },
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
          range: {
            date,
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
          range: {
            closure_date: range,
          },
        });
      }
    }

    if (missionRange) {
      if (missionRange.from || missionRange.to) {
        const range = {};

        if (missionRange.from) {
          range.gte = missionRange.from;
        }
        if (missionRange.to) {
          range.lte = missionRange.to;
        }
        must.push({
          range: {
            dateMission: range,
          },
        });
      }
    }

    if (validator && validator.id) {
      must.push({
        term: { 'validation_user.id': validator.id },
      });
    }

    if (closer && closer.id) {
      must.push({
        term: { 'closure_user.id': closer.id },
      });
    }

    if (user && user.id) {
      must.push({
        term: { 'user.id': user.id },
      });
    }

    if (lastModified) {
      must.push({
        range: {
          lastModified: {
            gte: lastModified,
          },
        },
      });
    }

    const filter = must.length
      ? {
          bool: {
            must,
          },
        }
      : undefined;

    const multi_match = q
      ? {
          // operator: 'and',
          fields: [
            'manager.name',
            // 'manager.email',

            'client.name',
            // 'client.email',

            'agent.name',
            // 'agent.email',

            'refNo',

            'company',

            'vehicle.manufacturer',
            'vehicle.model',
            'vehicle.plateNumber',
            'vehicle.series',
            'vehicle.mileage',
            'vehicle.DMC',
            'vehicle.energy',
            'vehicle.power',
          ],
          query: q,
        }
      : undefined;

    const query =
      filter || multi_match
        ? {
            bool: {
              must: {
                multi_match,
              },
              filter,
            },
          }
        : { match_all: {} };

    const sort = [
      '_score',
      // {
      //   lastModified: {
      //     order: 'desc',
      //   },
      // },
    ];

    const SORT_DIRECTION_MAP = {
      SORT_DIRECTION_ASC: 'asc',
      SORT_DIRECTION_DESC: 'desc',
    };

    sort.push({
      [`${sortConfig && sortConfig.key ? sortConfig.key : 'date'}`]: {
        order: sortConfig.direction
          ? SORT_DIRECTION_MAP[sortConfig.direction]
          : 'desc',
      },
    });

    let size = cursor === 0 ? LIMIT_PER_PAGE : LIMIT_PER_NEXT_PAGE;

    if (returnAll) {
      const { hits } = await es.search({
        index: config.esIndex,
        type: 'doc',
        body: {
          query: {
            match_all: {},
          },
        },
      });

      size = hits.total;
    }

    const searchParams = {
      index: config.esIndex,
      type: 'doc',
      from: returnAll ? 0 : cursor,
      size,
      body: {
        sort,
        query,
        highlight: {
          pre_tags: [`<mark class='hit'>`],
          post_tags: ['</mark>'],
          fields: {
            'manager.name': {},
            // 'manager.email'         : {},

            'agent.name': {},
            // 'agent.email'       : {},

            refNo: {},

            company: {},

            'vehicle.manufacturer': {},
            'vehicle.model': {},
            'vehicle.plateNumber': {},
            'vehicle.series': {},
            'vehicle.mileage': {},
            'vehicle.DMC': {},
            'vehicle.energy': {},
            'vehicle.power': {},

            'client.name': {},
            // 'client.email'        : {},
          },
        },
      },
    };

    return await es.search(searchParams).then(({ took, hits }) => ({
      took: took,
      length: hits.total,
      max_score: hits.max_score,
      hits: hits.hits,
      cursor: cursor + hits.hits.length,
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

      const filter = must.length
        ? {
            bool: {
              must,
            },
          }
        : undefined;

      const multi_match = {
        // operator: 'or',
        fields: [
          'manager.name',
          // 'manager.email',

          'client.name',
          // 'client.email',

          'agent.name',
          // 'agent.email',

          'refNo',

          'company',

          'vehicle.manufacturer',
          'vehicle.model',
          'vehicle.plateNumber',
          'vehicle.series',
          'vehicle.mileage',
          'vehicle.DMC',
          'vehicle.energy',
          'vehicle.power',

          'user.name',
          // 'user.email',

          'validation_user.name',
          // 'validation_user.email',

          'payment_user.name',

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
        index: config.esIndex,
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
            pre_tags: [`<mark class='hit'>`],
            post_tags: ['</mark>'],
            fields: {
              'manager.name': {},
              // 'manager.email'                  : {},

              'user.name': {},
              // 'user.email'                   : {},

              'agent.name': {},
              // 'agent.email'                : {},

              refNo: {},

              company: {},

              'vehicle.manufacturer': {},
              'vehicle.model': {},
              'vehicle.plateNumber': {},
              'vehicle.series': {},
              'vehicle.mileage': {},
              'vehicle.DMC': {},
              'vehicle.energy': {},
              'vehicle.power': {},

              'client.name': {},
              // 'client.email'                 : {},

              'validation_user.name': {},
              // 'validation_user.email'        : {},

              'payment_user.name': {},

              'closure_user.name': {},
              // 'closure_user.email'           : {},
            },
          },
        },
      };

      return es.search(searchParams).then(({ took, hits }) => ({
        took: took,
        length: hits.total,
        max_score: hits.max_score,
        hits: hits.hits,
        cursor: hits.hits.length,
      }));
    }

    return {
      took: 0,
      max_score: 0,
      hits: [],
      cursor: 0,
      length: 0,
    };
  }

  esSearchUsersByRoles(queryString, roles) {
    if (queryString) {
      let type_match;

      const type = getType(roles);

      if (roles.indexOf(Role_ADMINISTRATORS) !== -1) {
        type_match = {
          isAdmin: true,
        };
      } else {
        if (type !== null) {
          type_match = {
            type,
          };
        }
      }

      const filter = type_match
        ? {
            bool: {
              must: { match: type_match },
            },
          }
        : undefined;

      const name_match = queryString
        ? {
            name: queryString,
          }
        : undefined;

      const query = {
        bool: {
          must: {
            match: name_match,
          },
          filter,
        },
      };

      const searchParams = {
        index: config.esIndex,
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
        took: took,
        total: hits.total,
        max_score: hits.max_score,
        hits: hits.hits,
      }));
    }

    return {
      took: 0,
      total: 0,
      max_score: 0,
      hits: [],
    };

    function getType(roles) {
      if (userHasRoleAny({ roles }, Role_ADMINISTRATORS, Role_MANAGERS)) {
        return 'EMPLOYEE';
      }

      if (userHasRoleAny({ roles }, Role_CLIENTS)) {
        return 'CLIENT';
      }

      if (userHasRoleAny({ roles }, Role_AGENTS)) {
        return 'AGENT';
      }

      return null;
    }
  }

  getDocs(
    queryString,
    cursor = 0,
    sortConfig,
    client,
    manager,
    state,
    user,
    topLevelFields,
  ) {
    return Promise.all([count(), doFetch()]).then(([length, docs]) => ({
      cursor: cursor + docs.length,
      length,
      docs,
    }));

    function getQuery() {
      const q = new Parse.Query(DocType).matchesQuery(
        'business',
        businessQuery(),
      );

      if (client) {
        q.equalTo('client', Parse.User.createWithoutData(client));
      }

      if (manager) {
        q.equalTo('manager', Parse.User.createWithoutData(manager));
      }

      if (state) {
        q.equalTo('state', state);
      }

      // Not deleted
      q.doesNotExist('deletion_date');
      q.doesNotExist('deletion_user');

      return q;
    }

    function count() {
      if (topLevelFields.indexOf('length') !== -1) {
        return getQuery().count({ useMasterKey: true });
      }
      return Promise.resolve(0);
    }

    function doFetch() {
      const q = getQuery().limit(
        cursor > 0 ? LIMIT_PER_NEXT_PAGE : LIMIT_PER_PAGE,
      );

      q[
        !sortConfig.direction || sortConfig.direction === SORT_DIRECTION_ASC
          ? 'ascending'
          : 'descending'
      ](
        !sortConfig.key || sortConfig.key === 'dateMission'
          ? 'dateMission'
          : sortConfig.key,
      );

      if (cursor) {
        q.skip(cursor);
      }

      q.include([
        'manager',
        'client',
        'user',
        'agent',
        'validation_user',
        'payment_user',
      ]);

      return q.find({ useMasterKey: true });
    }
  }

  openDashboard(
    durationInDays,
    cursor,
    sortConfig,
    user,
    now,
    selectionSet,
    validOnly,
    returnAll,
  ) {
    if (!user) {
      return Promise.resolve({
        length: 0,
        docs: [],
        cursor: 0,
      });
    }

    return Promise.all([doFetch(), doCount()]).then(([docs, length]) => ({
      length,
      docs,
      cursor: cursor + docs.length,
    }));

    function getQuery() {
      const q = new Parse.Query(DocType)
        .equalTo('state', 'OPEN')
        .matchesQuery('business', businessQuery());

      if (durationInDays === -1) {
        q.lessThan('dateMission', new Date(now - 94672800000));
      } else {
        q.greaterThanOrEqualTo(
          'dateMission',
          new Date(now - durationInDays * 24 * 60 * 60 * 1000),
        );
      }

      // Not validated
      q.doesNotExist('validation_date');
      q.doesNotExist('validation_amount');

      // Not deleted
      q.doesNotExist('deletion_date');
      q.doesNotExist('deletion_user');

      return q;
    }

    function doFetch() {
      const q = getQuery().include([
        'user',
        'payment_user',
        'validation_user',
        'manager',
        'client',
        'agent',
      ]);

      if (returnAll === false) {
        q.limit(cursor > 0 ? LIMIT_PER_NEXT_PAGE : LIMIT_PER_PAGE);
      }

      if (cursor && returnAll === false) {
        q.skip(cursor);
      }

      q[
        sortConfig.direction === SORT_DIRECTION_ASC ? 'ascending' : 'descending'
      ](
        !sortConfig.key || sortConfig.key === 'dateMission'
          ? 'dateMission'
          : sortConfig.key,
      );

      return q.find({ useMasterKey: true });
    }

    function doCount() {
      if (selectionSet.indexOf('length') !== -1) {
        return getQuery().count({ useMasterKey: true });
      }

      return Promise.resolve(0);
    }
  }
  // closedDashboard(durationInDays, cursor, sortConfig, user, now, selectionSet, includeCanceled) {
  //   if (!user) {
  //     return Promise.resolve({
  //       length: 0,
  //       docs: [],
  //       cursor: 0,
  //     });
  //   }
  //
  //   return Promise.all([doFetch(), doCount()]).then(([ docs, length ]) => ({
  //     length,
  //     docs,
  //     cursor: cursor + docs.length,
  //   }));
  //
  //   function getQuery() {
  //     let q = new Parse.Query(DocType).equalTo('state', 'CLOSED');
  //
  //     if (includeCanceled) {
  //       q = [
  //         q,
  //         new Parse.Query(DocType).equalTo('state', 'CANCELED'),
  //       ];
  //     }
  //
  //     q = (Array.isArray(q) ? Parse.Query.or.apply(Parse.Query, q) : q)
  //       .matchesQuery('business', businessQuery());
  //
  //     if (durationInDays === -1) {
  //       q.lessThan('closure_date', new Date(now - (94672800000)));
  //     } else {
  //       q.greaterThanOrEqualTo('closure_date', new Date(now - (durationInDays * 24 * 60 * 60 * 1000)));
  //     }
  //
  //     // Not deleted
  //     q.doesNotExist('deletion_date');
  //     q.doesNotExist('deletion_user');
  //
  //     return q;
  //   }
  //
  //   function doFetch() {
  //     const q = getQuery()
  //       .limit(cursor > 0 ? LIMIT_PER_NEXT_PAGE : LIMIT_PER_PAGE)
  //       .include([
  //         'closure_user',
  //         'manager',
  //         'client',
  //         'agent',
  //       ]);
  //
  //     if (cursor) {
  //       q.skip(cursor);
  //     }
  //
  //     q[sortConfig.direction === SORT_DIRECTION_ASC ? 'ascending' : 'descending'](
  //       !sortConfig.key || sortConfig.key === 'date' ? 'date' : sortConfig.key
  //     );
  //
  //     return q.find({ useMasterKey : true });
  //   }
  //
  //   function doCount() {
  //     if (selectionSet.indexOf('length') !== -1){
  //       return getQuery().count({ useMasterKey : true });
  //     }
  //
  //     return Promise.resolve(0);
  //   }
  //
  // }

  recentDocs(user) {
    if (!user) {
      return Promise.resolve([]);
    }

    return new Parse.Query(DocType)
      .doesNotExist('deletion_date')
      .doesNotExist('deletion_user')
      .descending([`lastModified_${user.id}`, 'lastModified', 'date'])
      .limit(RECENT_DOCS_LIMIT)
      .include([
        'user',
        'payment_user',
        'validation_user',
        'manager',
        'client',
        'agent',
      ])
      .find({ useMasterKey: true });
  }

  async dashboard(user, selectionSet) {
    if (!user) {
      return {
        open: { count: 0 },
        closed: { count: 0 },
        canceled: { count: 0 },
      };
    }

    const results = await Promise.all(
      selectionSet.map(state => this.counts.load(state)),
    );

    return selectionSet.reduce((memo, state, index) => {
      memo[state] = { count: results[index] };
      return memo;
    }, {});
  }
}
