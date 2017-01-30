import {
  TOGGLE_KEY,
} from './constants';

import { Record, Set } from 'immutable';

class SelectionState extends Record({
  keys : Set.of(),
}) {}

export const initialState = new SelectionState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_KEY: {
      return state.update('keys', (keys) => {
        return keys.includes(action.key)
          ?  keys.delete(action.key)
          :  keys.add(action.key);
      });
    }
    default:
      return state;
  }
}

