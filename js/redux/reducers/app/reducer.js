import {
  READY,
  RESIZE,
  CONNECTION_STATE_CHANGE,
} from './constants';

import { isServer } from 'vars';

import Immutable from 'immutable';

const MEDIA_QUERY = '(min-width: 992px)';

const initialState = Immutable.fromJS({
  displayMatches : isServer || matchMedia(MEDIA_QUERY).matches,
  onLine         : true,
  isReady        : false,
});

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
    default:
      return state;
  }
}

