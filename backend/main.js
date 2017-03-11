import path from 'path';
import fs from 'fs';

import config from 'build/config';

import publish from 'backend/kue-mq/publish';

import * as es from 'backend/es';

import { genDocs, loaders } from 'backend/mocks';

import { getOrCreateBusiness, deserializeParseObject } from 'backend/utils';

import { DocType, ActivityType } from 'data/types';

import {
  UPDATE_USER_BUSINESS,
  SET_PASSWORD,
  UPDATE_ACCOUNT_SETTINGS,
  RESEND_EMAIL_VERIFICATION,
  PASSWORD_RESET,
  SIGN_UP,
  CHANGE_EMAIL,
} from './constants';

const log = require('log')('app:backend');

import {
  signUp as doSignUp,
  resendEmailVerification,
  passwordReset,
  updateAccountSettings,
  setPassword,
  changeEmail,
} from './ops/auth';

// import {
//   updateUserBusiness,
// } from './ops/business';

Parse.Cloud.define('routeOp', async function (request, response) {
  const operationKey = request.params.__operationKey;
  const req = { user: request.user, params: request.params.args };

  switch (operationKey) {
    case UPDATE_USER_BUSINESS: {
      // return updateUserBusiness(req, response);

      try {
        const { data : business, job } = await publish('MAIN', UPDATE_USER_BUSINESS, req);
        response.success(deserializeParseObject(business));
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case SET_PASSWORD: {
      return setPassword(req, response);
    }
    case CHANGE_EMAIL: {
      return changeEmail(req, response);
    }
    case UPDATE_ACCOUNT_SETTINGS: {
      return updateAccountSettings(req, response);
    }
    case PASSWORD_RESET: {
      return passwordReset(req, response);
    }
    case RESEND_EMAIL_VERIFICATION: {
      return resendEmailVerification(req, response);
    }
    case SIGN_UP: {
      return doSignUp(req, response);
    }
    default:
      response.error(new Error('OperationNotFound', operationKey));
  }
});

Parse.Cloud.define('initialization', function (request, response) {
  response.success({});
});

Parse.Cloud.define('initUsers', async function (request, response) {
  if (config.sample_data) {

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

    let initJob = require('../data/_User.json').reduce(function (job, obj) {
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

    initJob = initJob.then(async () => {
      const docsFilePath = path.resolve(process.cwd(), 'backend', 'mocks', '_docs.json');
      if (!fs.existsSync(docsFilePath)) {
        const docs = genDocs();
        return fs.writeFileSync(docsFilePath, JSON.stringify(docs, null, 2), 'utf8');
      } else {
        const docs = require(docsFilePath);
        const activities = [];

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

              const obj = await new DocType().set({
                refNo      : doc.refNo,
                date       : new Date(doc.date),
                vehicle    : doc.vehicle,
                agent      : await loaders.usernames.load(doc.agent),
                client     : await loaders.usernames.load(doc.client),
                user       : await loaders.usernames.load(doc.user),
                validation : doc.validation ? { ...doc.validation, user: (await loaders.usernames.load(doc.validation.user)).id } : null,
                closure    : doc.closure ? { ...doc.closure, user: (await loaders.usernames.load(doc.closure.user)).id } : null,
                state      : doc.status,
                business  : await getOrCreateBusiness(),
              }).save(null, { useMasterKey : true });

              doc.activities.forEach(async ({ type, ...metadata }) => {
                activities.push({
                  ns        : 'DOCUMENTS',
                  type      : type,
                  metadata  : { ...metadata, date : new Date(metadata.date), user: metadata.user ? (await loaders.usernames.load(metadata.user)).id : undefined },
                  timestamp : new Date(metadata.date),
                  document  : obj,
                  business  : await getOrCreateBusiness(),
                });
              });

              log(`Doc ${doc.refNo} successfully created.`);

              // Index doc
              es.onDoc(obj.id);

              return obj;
            }
          });
        }, Promise.resolve());

        if (activities.length > 0) {
          log(`Creating ${activities.length} activities...`);
          try {
            await Parse.Object.saveAll(
              activities.map((data) => new ActivityType().set(data)), { useMasterKey : true });

          } catch (e) {
            log.error(`Error creating activities`, e.message);
          }

        }

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
  } else {
    response.success({});
  }
});

