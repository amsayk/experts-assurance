import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

import Parse from 'parse';

import invariant from 'invariant';

import debug from 'log';

import LOG_IN_MUTATION from './logIn.mutation.graphql';
import LOG_OUT_MUTATION from './logOut.mutation.graphql';

const log = debug('app:client:auth');

export function logIn(username, password) {
  return async (dispatch, _, { client }) => {
    const { data: { logIn: { user, error } } } = await client.mutate({
      mutation: LOG_IN_MUTATION,
      variables: {
        username,
        password,
      },
    });

    if (error) {
      log.error(error);
      throw new Error();
    } else {
      invariant(user, '`user` must be defined at this point.');

      try {
        // Clear cache is required!
        Parse.User._clearCache();
      } finally {}

      dispatch({
        type    : USER_LOGGED_IN,
        payload : user,
      });
    }
  };
}

export function logOut(manual = true) {
  return async (dispatch, _, { client }) => {
    try {
      const { data: { logOut: { error } } } = await client.mutate({
        mutation: LOG_OUT_MUTATION,
      });

      if (error) {
        log.error(error);
      }
    } catch (e) {
      log.error(e);
    } finally {
      dispatch({ type: USER_LOGGED_OUT, manual });
      manual && await client.resetStore();
    }
  };
}

