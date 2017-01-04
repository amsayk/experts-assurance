import Parse from 'parse';
import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

export function login(payload) {
  return {
    type: USER_LOGGED_IN,
    payload,
  };
}

export function logOut() {
  return async (dispatch, getState, { client }) => {
    try {
      await Parse.User.logOut();
    } finally {
      dispatch({ type: USER_LOGGED_OUT });
      client.resetStore();
    }
  };
}

