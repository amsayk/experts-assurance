import {
  READY,
  RESIZE,
  CONNECTION_STATE_CHANGE,
  APP_STATE_CHANGE,
  TOGGLE_ALERTS,
  ADD_DOC,
  CLOSE_DOC,
} from './constants';

import debounce from 'debounce';

import gql from 'graphql-tag';

import SUBSCRIPTION from './app.subscription.graphql';

export function ready() {
  return (dispatch, getState, { client }) => {
    const { sessionToken } = getState().get('user');

    if (sessionToken) {
      const obs = client.subscribe({
        query: SUBSCRIPTION,
        variables: { sessionToken },
      });

      obs.subscribe({
        next: debounce(function({ onActivityEvent: { activity } }) {
          // Refresh relevants queries
          try {
            const QUERIES = [
              'getLastRefNo',
              'getTimeline',
              'getDocs',
              'esQueryDocs',
              'dashboard',
              'openDocs',
              'invalidDocs',
              'unpaidDocs',
              'getOngoingImportation',
              'getImportation',
              'getDoc',
              'settings_users__getUsers',
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
        }, 1000),
        error(error) {},
      });
    }

    dispatch({
      type: READY,
    });
  };
}

export function resize() {
  return {
    type: RESIZE,
  };
}

export function connectionStateChange(isConnected) {
  return {
    type: CONNECTION_STATE_CHANGE,
    isConnected,
  };
}

export function appStateChange(currentState) {
  return {
    type: APP_STATE_CHANGE,
    currentState,
  };
}

export function toggleAlerts() {
  return {
    type: TOGGLE_ALERTS,
  };
}

export function startAddingDoc() {
  return {
    type: ADD_DOC,
    addingDoc: true,
  };
}

export function finishAddingDoc() {
  return {
    type: ADD_DOC,
    addingDoc: false,
  };
}

export function startClosingDoc() {
  return {
    type: CLOSE_DOC,
    closingDoc: true,
  };
}

export function finishClosingDoc() {
  return {
    type: CLOSE_DOC,
    closingDoc: false,
  };
}
