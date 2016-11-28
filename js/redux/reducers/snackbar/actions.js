import {
  UPDATE,
} from './constants';

export function update(payload) {
  return {
    type: UPDATE,
    payload,
  };
}

