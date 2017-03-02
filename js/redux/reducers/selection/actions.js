import {
  ACTION,
  SET,
  ADD,
  TOGGLE,
} from './constants';

function dispatchSelectionAction(category, action) {
  return {
    type     : `${ACTION}/${category}`,
    payload  : action,
  };
}

export const set = (category) => (keyOrKeys) => dispatchSelectionAction(category, {
  type : SET,
  keys : Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys],
});

export const add = (category) => (keyOrKeys) => dispatchSelectionAction(category, {
  type : ADD,
  keys : Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys],
});

export const toggle = (category) => (key) => dispatchSelectionAction(category, {
  type : TOGGLE,
  key  : key,
});

