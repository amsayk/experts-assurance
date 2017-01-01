import { RESIZE, CONNECTION_STATE_CHANGE, READY } from './constants';

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

export function ready() {
  return {
    type: READY,
  };
}

