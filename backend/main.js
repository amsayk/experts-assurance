import publish from 'backend/kue-mq/publish';

import { getOrCreateBusiness, serializeParseObject, deserializeParseObject } from 'backend/utils';

import {
  UPDATE_USER_BUSINESS,

  SET_PASSWORD,
  UPDATE_ACCOUNT_SETTINGS,
  RESEND_EMAIL_VERIFICATION,
  PASSWORD_RESET,
  SIGN_UP,
  CHANGE_EMAIL,

  AUTHORIZE_MANAGER,
  REVOKE_MANAGER_AUTHORIZATION,

  ADD_DOC,
  DELETE_DOC,
  RESTORE_DOC,
  SET_MANAGER,
  SET_STATE,
  CLOSE_DOC,
  CANCEL_DOC,

  // Payments
  SET_PAY,
  DEL_PAY,

  // Files
  UPLOAD_FILE,
  DELETE_FILE,
  RESTORE_FILE,
} from './constants';

const log = require('log')('app:backend');

Parse.Cloud.define('routeOp', async function (request, response) {
  const operationKey = request.params.__operationKey;
  const req = {
    user   : serializeParseObject(request.user),
    now    : Date.now(),
    params : request.params.args,
  };

  switch (operationKey) {
    case UPLOAD_FILE: {
      try {
        const { data : { file, activities } } = await publish('MAIN', operationKey, req, { timeout: 15 * 60 * 1000 });
        response.success({
          file       : deserializeParseObject(file),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case DELETE_FILE: {
      try {
        const { data : { file, activities } } = await publish('MAIN', operationKey, req);
        response.success({
          file       : deserializeParseObject(file),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case RESTORE_FILE: {
      try {
        const { data : { file, activities } } = await publish('MAIN', operationKey, req);
        response.success({
          file       : deserializeParseObject(file),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case ADD_DOC: {
      try {
        const { data : { doc, activities } } = await publish('MAIN', operationKey, req, { timeout: 5 * 60 * 1000 });
        response.success({
          doc        : deserializeParseObject(doc),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case SET_PAY: {
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
    case DEL_PAY: {
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
    case RESTORE_DOC: {
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
    case SET_MANAGER: {
      try {
        const { data: { manager, doc, activities } } = await publish('MAIN', operationKey, req);
        response.success({
          doc        : deserializeParseObject(doc),
          manager    : deserializeParseObject(manager),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case SET_STATE: {
      try {
        const { data: { doc, activities } } = await publish('MAIN', operationKey, req);
        response.success({
          doc        : deserializeParseObject(doc),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case CLOSE_DOC: {
      try {
        const { data: { doc, activities } } = await publish('MAIN', operationKey, req);
        response.success({
          doc        : deserializeParseObject(doc),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case CANCEL_DOC: {
      try {
        const { data: { doc, activities } } = await publish('MAIN', operationKey, req);
        response.success({
          doc        : deserializeParseObject(doc),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case AUTHORIZE_MANAGER: {
      try {
        const { data: { user, activities } } = await publish('MAIN', operationKey, req);
        response.success({
          user       : deserializeParseObject(user),
          activities : activities.map(deserializeParseObject),
        });
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case REVOKE_MANAGER_AUTHORIZATION: {
      try {
        const { data: { user, activities } } = await publish('MAIN', operationKey, req);
        response.success({
          user       : deserializeParseObject(user),
          activities : activities.map(deserializeParseObject),
        });
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
        await publish('AUTH', operationKey, req);
        response.success({});
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case CHANGE_EMAIL: {
      try {
        const { data : user } = await publish('AUTH', operationKey, req);
        response.success(user);
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case UPDATE_ACCOUNT_SETTINGS: {
      try {
        const { data : user } = await publish('AUTH', operationKey, req);
        response.success(deserializeParseObject(user));
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case PASSWORD_RESET: {
      try {
        await publish('AUTH', operationKey, req);
        response.success({});
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case RESEND_EMAIL_VERIFICATION: {
      try {
        await publish('AUTH', operationKey, req);
        response.success({});
      } catch(e) {
        response.error(e);
      }
      break;
    }
    case SIGN_UP: {
      try {
        const { data : user } = await publish('AUTH', operationKey, req);
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

