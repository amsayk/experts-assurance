import Parse from 'parse';
import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

import { updateLocation } from 'redux/reducers/routing/actions';

export function login(payload) {
  return {
    type: USER_LOGGED_IN,
    payload,
  };
}

export function logout() {
  return async (dispatch, getState, client) => {

    function onLogout() {
      dispatch({ type: USER_LOGGED_OUT });
      dispatch(updateLocation('/'));
      client.resetStore();
    }

    try {
      await Parse.User.logOut();
    } finally {
      onLogout();
    }
  };
}

