import {
  ACTION,
  TOGGLE_KEY,
} from './constants';

function dispatchSelectionAction(id, action) {
  return {
    selectionKey : id,
    type         : ACTION,
    payload      : action,
  };
}

export const toggleKey = (id) => (key) => {
  return dispatchSelectionAction(id, {
    type: TOGGLE_KEY,
    key,
  });
};

