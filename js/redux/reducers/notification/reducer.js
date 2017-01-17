import getCurrentUser from 'getCurrentUser';

import { INIT } from 'vars';

import { USER_LOGGED_OUT, USER_LOGGED_IN } from 'redux/reducers/user/constants';

import { LOCATION_CHANGE } from 'redux/reducers/routing/constants';

import {
  UPDATE_NOTIFICATION,
  REMOVE_NOTIFICATION,
} from './constants';

import {
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_DETAILS,
} from 'vars';

import { fromJS } from 'immutable';

const initialState = fromJS({
  id: null,
  options: {
    active    : false,
    animation : null,
    persist   : false,
    duration  : null,
  },
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NOTIFICATION: {
      if (typeof action.id === 'undefined' || action.id === state.get('id')) {
        return state.merge(action.payload);
      }
      return state;
    }
    case REMOVE_NOTIFICATION: {
      if (typeof action.id === 'undefined' || action.id === state.get('id')) { // Clear all but required.
        return maybeRequiredNotification(state);
      }
      return state;
    }
    case USER_LOGGED_IN:
    case INIT: {
      return maybeRequiredNotification(state);
    }
    case USER_LOGGED_OUT:
      return initialState;
    case LOCATION_CHANGE: {
      switch (state.get('id')) {
        case 'BusinessRequired':
          return state.merge({
            options: {
              active: action.payload.pathname !== PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_DETAILS,
            },
          });
        default:
          return state;
      }
    }
    default:
      return state;
  }
}

function maybeRequiredNotification(state) {
  const user = getCurrentUser();
  if (user) {
    if (!user.get('emailVerified')) { // Email verification takes precedence.
      return fromJS({
        id: 'VerificationPending',
        options: {
          persist: true,
          active: true,
        },
      });
    } else if (!user.has('business')) {
      return fromJS({
        id: 'BusinessRequired',
        options: {
          persist: true,
          active: true,
        },
      });
    } else {
      return initialState;
    }
  }
  return state;
}
