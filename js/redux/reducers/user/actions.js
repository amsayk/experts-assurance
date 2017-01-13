import Parse from 'parse';
import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

const log = require('debug')('app:client:auth');

export function login(payload) {
  return {
    type: USER_LOGGED_IN,
    payload,
  };
}

export function logOut() {
  return async (dispatch, _, { client }) => {
    try {
      await Parse.User.logOut();
    } catch (e) {
      switch (e.code) {
        case Parse.Error.INVALID_SESSION_TOKEN:
          log.error('INVALID_SESSION_TOKEN: clearing storage.');
          return Parse.CoreManager.getStorageController().clear();
        default:
          log.error(e);
      }
    } finally {
      dispatch({ type: USER_LOGGED_OUT });
      client.resetStore();
    }
  };
}

