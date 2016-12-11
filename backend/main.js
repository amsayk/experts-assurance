import {
  RESEND_PASSWORD_VERIFICATION,
  PASSWORD_RESET,
  SIGN_UP,
} from './constants';

const debug = require('debug')('app:backend');
const error = require('debug')('app:backend:error');

import { signUp as doSignUp, resendPasswordVerification, passwordReset } from './ops/user';

Parse.Cloud.define('routeOp', function (request, response) {
  const operationKey = request.params.__operationKey;
  const req = { user: request.user, params: request.params.args };

  switch (operationKey) {
    case PASSWORD_RESET: {
      return passwordReset(req, response);
    }
    case RESEND_PASSWORD_VERIFICATION: {
      return resendPasswordVerification(req, response);
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

Parse.Cloud.define('initUsers', function (request, response) {

  function doAdd(obj) {
    debug(obj.displayName + ' doesn\'t exist, creating now...');

    const p = new Parse.User();

    p.setPassword(obj.password);
    p.set('email', obj.email);
    p.set('username', obj.username);

    p.set('displayName', obj.displayName);

    return p.signUp(null, {
      useMasterKey: true,
      success: function (user) {
        debug('Successfully created user `', user.get('displayName'), '`');
      },
      error: function (user, err) {
        error('Error creating user `' + obj.displayName + '`: ', err);
      },
    });
  }

  const promises = require('../data/_User').map(function (obj) {
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

  Promise.all(promises).then(
    function () {
      response.success({});
    },
    function (err) {
      response.error(err);
    }
  );
});

