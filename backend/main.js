import {
  UPDATE_USER_BUSINESS,
  SET_PASSWORD,
  UPDATE_ACCOUNT_SETTINGS,
  RESEND_EMAIL_VERIFICATION,
  PASSWORD_RESET,
  SIGN_UP,
  CHANGE_EMAIL,

  // Catalog
  ADD_PRODUCT,
} from './constants';

const log = require('log')('app:backend');

import {
  signUp as doSignUp,
  resendEmailVerification,
  passwordReset,
  updateAccountSettings,
  setPassword,
  changeEmail,
} from './ops/user';

import {
  addProduct,
} from './ops/catalog';

import {
  updateUserBusiness,
} from './ops/business';

Parse.Cloud.define('routeOp', function (request, response) {
  const operationKey = request.params.__operationKey;
  const req = { user: request.user, params: request.params.args };

  switch (operationKey) {
    case UPDATE_USER_BUSINESS: {
      return updateUserBusiness(req, response);
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
    case ADD_PRODUCT: {
      return addProduct(req, response);
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
    log(obj.displayName + ' doesn\'t exist, creating now...');

    const p = new Parse.User();

    p.setPassword(obj.password);
    p.set('email', obj.email);
    p.set('username', obj.username);

    p.set('displayName', obj.displayName);

    return p.signUp(null, {
      useMasterKey: true,
      success: function (user) {
        log('Successfully created user `', user.get('displayName'), '`');
      },
      error: function (user, err) {
        log.error('Error creating user `' + obj.displayName + '`: ', err);
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

