import {
  RESIZE,
  CONNECTION_STATE_CHANGE,
} from './constants';

import {
  isServer,
} from 'env';

import Immutable from 'immutable';

const MEDIA_QUERY = '(min-width: 992px)';

const initialState = Immutable.fromJS({
  displayMatches: isServer || matchMedia(MEDIA_QUERY).matches,
  onLine: isServer || window.navigator.onLine,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case RESIZE:

      return state.merge({
        displayMatches: matchMedia(MEDIA_QUERY).matches,
      });

    case CONNECTION_STATE_CHANGE:

      return state.merge({
        onLine: window.navigator.onLine,
      });

    default:
      return state;
  }
}
