import {
  RESIZE,
  CONNECTION_STATE_CHANGE,
  READY,
  TOGGLE_ALERTS,
} from './constants';

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

export function toggleAlerts() {
  return {
    type: TOGGLE_ALERTS,
  };
}

