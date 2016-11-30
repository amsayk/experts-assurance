import { RESIZE, CONNECTION_STATE_CHANGE, READY } from './constants';

export function resize() {
  return {
    type: RESIZE,
  };
}

export function connectionStateChange() {
  return {
    type: CONNECTION_STATE_CHANGE,
  };
}

export function ready() {
  return {
    type: READY,
  };
}

