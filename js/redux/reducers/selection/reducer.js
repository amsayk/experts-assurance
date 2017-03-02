import {
  SET,
  ADD,
  TOGGLE,
} from './constants';

import { Record, Set } from 'immutable';

export class SelectionState extends Record({
  keys : Set.of(),
}) {}

export const initialState = new SelectionState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET: {
      return state.set('keys', Set.of(...action.keys));
    }
    case ADD: {
      return state.update('keys', (keys) => {
        return keys.union(action.keys);
      });
    }
    case TOGGLE: {
      return state.update('keys', (keys) => {
        return keys.includes(action.key)
          ? keys.delete(action.key)
          : keys.add(action.key);
      });
    }
    default:
      return state;
  }
}

