import {
  RESIZE,
  CONNECTION_STATE_CHANGE,
  APP_STATE_CHANGE,
  READY,
  TOGGLE_ALERTS,

  ADD_DOC,
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

export function appStateChange(currentState) {
  return {
    type: APP_STATE_CHANGE,
    currentState,
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

export function startAddingDoc() {
  return {
    type      : ADD_DOC,
    addingDoc : true,
  };
}

export function finishAddingDoc() {
  return {
    type      : ADD_DOC,
    addingDoc : false,
  };
}

export function saveNewDoc(data) {
  return async (dispatch, _, { client }) => {

  };
}

