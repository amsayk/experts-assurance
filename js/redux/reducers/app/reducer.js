import {
  READY,
  RESIZE,
  CONNECTION_STATE_CHANGE,
  TOGGLE_ALERTS,
} from './constants';

import { INIT } from 'vars';

import { isServer } from 'vars';

import { Record } from 'immutable';

const MEDIA_QUERY = '(min-width: 992px)';

class AppState extends Record(maybeAppState()) {}

const initialState = new AppState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RESIZE:
      return state.merge({
        displayMatches: matchMedia(MEDIA_QUERY).matches,
      });
    case CONNECTION_STATE_CHANGE:
      return state.merge({
        onLine: action.isConnected,
      });
    case READY:
      return state.merge({
        isReady: true,
      });
    case TOGGLE_ALERTS:
      return state.merge({
        alertsOpen: !state.alertsOpen,
      });
    case INIT: {
      return new AppState(maybeAppState());
    }
    default:
      return state;
  }
}

function maybeAppState() {
  return {
    displayMatches : isServer || matchMedia(MEDIA_QUERY).matches,
    onLine         : true,
    isReady        : false,
    alertsOpen     : false,
  };
}

