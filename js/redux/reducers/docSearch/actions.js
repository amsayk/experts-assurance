import {
  ON_STATE,
  ON_TEXT_INPUT,
  TOGGLE_ADVANCED_MODE,
  TOGGLE_SEARCH,
  ON_CLEAR,
  MERGE,
} from './constants';

export function merge(opts) {
  return {
    type: MERGE,
    opts,
  };
}

export function onClear() {
  return {
    type: ON_CLEAR,
  };
}

export function toggleSearch(active = null) {
  return {
    type: TOGGLE_SEARCH,
    active,
  };
}

export function onState(state) {
  return {
    type: ON_STATE,
    state,
  };
}

export function onTextInput(q) {
  return {
    type: ON_TEXT_INPUT,
    q,
  };
}

export function toggleAdvancedMode() {
  return {
    type: TOGGLE_ADVANCED_MODE,
  };
}

// Sorting
import { sort, sortKey, sortDirection } from 'redux/reducers/sorting/actions';
export const sortDocs = sort('docSearch');
export const sortDocsByKey = sortKey('docSearch');
export const sortDocsByDirection = sortDirection('docSearch');

