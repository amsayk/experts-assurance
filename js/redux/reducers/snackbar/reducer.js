import {
  UPDATE_SNACKBAR,
} from './constants';

import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  active    : false,
  type      : null,
  message   : null,
  animation : null,
  persist   : false,
  action    : null,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SNACKBAR:
      return state.merge(action.payload);
    default:
      return state;
  }
}

