import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

import Parse from 'parse';

import invariant from 'invariant';

import debug from 'log';

import LOG_IN_MUTATION from './logIn.mutation.graphql';
import LOG_OUT_MUTATION from './logOut.mutation.graphql';

const log = debug('app:client:auth');

import SUBSCRIPTION from 'redux/reducers/app/app.subscription.graphql';

export function logIn(username, password) {
  return async (dispatch, getState, { client }) => {
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
      } finally {
      }

      const obs = client.subscribe({
        query: SUBSCRIPTION,
        variables: { sessionToken: user.sessionToken },
      });

      obs.subscribe({
        next({ onActivityEvent: { activity } }) {
          // Refresh relevants queries
          try {
            const QUERIES = [
              'getTimeline',
              // 'recentDocs',
              'getDocs',
              'esQueryDocs',
              'dashboard',
              'openDocs',
              'invalidDocs',
              'unpaidDocs',
              'getOngoingImportation',
              'getImportation',
              'getDoc',
            ];

            if (
              getState().getIn(['importation', 'user']) ===
              getState().getIn(['user']).id
            ) {
              QUERIES.push('recentDocs');
            }

            QUERIES.forEach(async q => {
              client.queryManager.refetchQueryByName(q);
            });
          } catch (e) {}
        },
        error(error) {},
      });

      dispatch({
        type: USER_LOGGED_IN,
        payload: user,
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
        throw error;
      }
    } catch (e) {
      log.error(e);
    } finally {
      dispatch({ type: USER_LOGGED_OUT, manual });
      manual && (await client.resetStore());
    }
  };
}
