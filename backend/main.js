import path from 'path';
import fs from 'fs';

import config from 'build/config';

import publish from 'backend/kue-mq/publish';

import * as es from 'backend/es';

import { genDocs, loaders } from 'backend/sample_data';

import { getOrCreateBusiness, genDocKey, deserializeParseObject } from 'backend/utils';

import { DocType, ActivityType } from 'data/types';

import {
  UPDATE_USER_BUSINESS,

  SET_PASSWORD,
  UPDATE_ACCOUNT_SETTINGS,
  RESEND_EMAIL_VERIFICATION,
  PASSWORD_RESET,
  SIGN_UP,
  CHANGE_EMAIL,

  AUTHORIZE_MANAGER,

  ADD_DOC,
  DELETE_DOC,
  SET_MANAGER,
  SET_STATE,
} from './constants';

const log = require('log')('app:backend');

Parse.Cloud.define('routeOp', async function (request, response) {
  const operationKey = request.params.__operationKey;
  const req = {
    user   : request.user,
    now    : Date.now(),
    params : request.params.args,
  };

  switch (operationKey) {
    case ADD_DOC: {
      try {
        const { data : { doc, activities } } = await publish('MAIN', operationKey, req);
        response.success({
          doc        : deserializeParseObject(doc),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case DELETE_DOC: {
      try {
        await publish('MAIN', operationKey, req);
        response.success({});
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case SET_MANAGER: {
      try {
        const { data: { manager, doc } } = await publish('MAIN', operationKey, req);
        response.success({
          manager : deserializeParseObject(manager),
          doc     : deserializeParseObject(doc),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case SET_STATE: {
      try {
        const { data: { doc } } = await publish('MAIN', operationKey, req);
        response.success({ doc : deserializeParseObject(doc) });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case AUTHORIZE_MANAGER: {
      try {
        const { data: { user } } = await publish('MAIN', operationKey, req);
        response.success(deserializeParseObject(user));
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case UPDATE_USER_BUSINESS: {
      try {
        const { data : business } = await publish('MAIN', operationKey, req);
        response.success(deserializeParseObject(business));
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case SET_PASSWORD: {
      try {
        await publish('MAIN', operationKey, req);
        response.success({});
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case CHANGE_EMAIL: {
      try {
        const { data : user } = await publish('MAIN', operationKey, req);
        response.success(user);
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case UPDATE_ACCOUNT_SETTINGS: {
      try {
        const { data : user } = await publish('MAIN', operationKey, req);
        response.success(deserializeParseObject(user));
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case PASSWORD_RESET: {
      try {
        await publish('MAIN', operationKey, req);
        response.success({});
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case RESEND_EMAIL_VERIFICATION: {
      try {
        await publish('MAIN', operationKey, req);
        response.success({});
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case SIGN_UP: {
      try {
        const { data : user } = await publish('MAIN', operationKey, req);
        response.success(deserializeParseObject(user));
      } catch(e) {
        response.error(e);
      }
      break;
    }
    default:
      response.error(new Error('OperationNotFound', operationKey));
  }
});

Parse.Cloud.define('onStart', async function (request, response) {

  function doAdd(obj) {
    log('\'' + obj.displayName + '\', username=' + obj.username + ' doesn\'t exist, creating now...');

    const p = new Parse.User();

    p.setPassword(obj.password);
    p.set('email', obj.email);
    p.set('username', obj.username);

    p.set('displayName', obj.displayName);

    if (obj.role) {
      p.addUnique('roles', obj.role);
    }

    p.set('business', business);

    return p.signUp(null, {
      useMasterKey: true,
      success: async function (user) {
        log('Successfully created user `', user.get('displayName'), '`');

        // Index user
        es.onUser(user.id);
      },
      error: function (user, err) {
        log.error('Error creating user `' + obj.displayName + '`: ', err);
      },
    });
  }

  const business = await getOrCreateBusiness();

  let initJob = require('data/_User.json').reduce(function (job, obj) {
    return job.then(function () {
      const query = new Parse.Query(Parse.User);
      query.equalTo('username', obj.username);

      return query.first({
        useMasterKey: true,
        error: function (err) {
          return doAdd(obj);
        },
        success: function (o) {
          if (!o) {
            return doAdd(obj);
          }
          return Promise.resolve(o);
        },
      });
    });

  }, Promise.resolve());

  initJob.then(
    function () {
      response.success({});
    },
    function (err) {
      response.error(err);
    }
  );

});

Parse.Cloud.define('importSamples', async function (request, response) {

  function doAdd(obj) {
    log('\'' + obj.displayName + '\', username=' + obj.username + ' doesn\'t exist, creating now...');

    const p = new Parse.User();

    p.setPassword(obj.password);
    p.set('mail', obj.email);
    p.set('username', obj.username);

    p.set('displayName', obj.displayName);

    if (obj.role) {
      p.addUnique('roles', obj.role);
    }

    p.set('business', business);

    return p.signUp(null, {
      useMasterKey: true,
      success: async function (user) {
        log('Successfully created user `', user.get('displayName'), '`');

        // Index user
        es.onUser(user.id);
      },
      error: function (user, err) {
        log.error('Error creating user `' + obj.displayName + '`: ', err);
      },
    });
  }

  const business = await getOrCreateBusiness();

  let initJob = Promise.resolve();


  // Add sample users
  initJob = initJob.then(() => {
    return require('backend/sample_data/utils/users.json').reduce(function (job, obj) {
      return job.then(() => {
        const query = new Parse.Query(Parse.User);
        query.equalTo('username', obj.username);

        return query.first({
          useMasterKey: true,
          error: function (err) {
            return doAdd(obj);
          },
          success: function (o) {
            if (!o) {
              return doAdd(obj);
            }
            return Promise.resolve(o);
          },
        });
      });
    }, Promise.resolve());
  });

  // add sample docs
  initJob = initJob.then(async () => {
    const docsFilePath = path.resolve(process.cwd(), 'backend', 'sample_data', '_docs.json');
    if (!fs.existsSync(docsFilePath)) {
      const docs = genDocs();
      return fs.writeFileSync(docsFilePath, JSON.stringify(docs, null, 2), 'utf8');
    } else {
      const docs = require(docsFilePath);
      // let activities = [];

      await docs.reduce((job, doc) => {
        return job.then(async () => {
          try {
            await loaders.refNo.load(doc.refNo);
            return;
          } catch (e) {
            return await doAdd();
          }

          async function doAdd() {
            log(`Doc ${doc.refNo} doesn't exist, creating now...`);

            const validation = doc.validation ? {
              validation_date : new Date(doc.validation.date),
              validation_user : (await loaders.usernames.load(doc.validation.user)),
            } : {};

            const closure = doc.closure ? {
              closure_date  : new Date(doc.closure.date),
              closure_state : doc.closure.state,
              closure_user  : (await loaders.usernames.load(doc.closure.user)),
            } : {};

            const obj = await new DocType()
              .set({
                refNo        : doc.refNo,
                date         : new Date(doc.date),
                vehicle      : doc.vehicle,
                agent        : (await loaders.usernames.load(doc.agent)),
                client       : (await loaders.usernames.load(doc.client)),
                manager      : doc.manager ? (await loaders.usernames.load(doc.manager)) : undefined,
                user         : (await loaders.usernames.load(doc.user)),
                state        : doc.status,
                business     : (await getOrCreateBusiness()),
                key          : (await genDocKey()),
                lastModified : new Date(),
                ...validation,
                ...closure,
              })
              .save(null, { useMasterKey : true });

            if (doc.activities.length > 0) {
              log(`Creating ${doc.activities.length} activities...`);

              try {
                const activities = await Promise.all(doc.activities.map(async ({ type, date, user, ...metadata }) => {
                  return new ActivityType().set({
                    ns        : 'DOCUMENTS',
                    type      : type,
                    metadata  : { ...metadata },
                    timestamp : new Date(date),
                    document  : obj,
                    business  : (await getOrCreateBusiness()),
                    user      : user ? (await loaders.usernames.load(user)) : obj.get('user'),
                  });
                }));
                await Parse.Object.saveAll(activities, { useMasterKey : true });

                log(`Activities successfully created.`);
              } catch (e) {
                log.error(`Error creating activities`, e.message);
                throw e;
              }
            }

            log(`Doc ${doc.refNo} successfully created.`);

            // Index doc
            await es.onDoc(obj.id);

            return obj;
          }
        });
      }, Promise.resolve());

      return;
    }
  });

  initJob.then(
    function () {
      response.success({});
    },
    function (err) {
      response.error(err);
    }
  );

});

