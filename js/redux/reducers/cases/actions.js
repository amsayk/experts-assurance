import {
  ON_SEARCH,
  ON_STATE,
  ON_CLIENT,
  ON_MANAGER,
  ON_AGENT,
} from './constants';

// Selection
import { set, add, toggle } from 'redux/reducers/selection/actions';
export const toggleSelection = toggle('cases');
export const setSelection    = set('cases');
export const addToSelection  = add('cases');

// Sorting
import { sort, sortKey, sortDirection } from 'redux/reducers/sorting/actions';
export const sortCases            = sort('cases');
export const sortCasesByKey       = sortKey('cases');
export const sortCasesByDirection = sortDirection('cases');

export function search(queryString) {
  return {
    type : ON_SEARCH,
    queryString,
  };
}

export function onClient(id) {
  return {
    type : ON_CLIENT,
    id,
  };
}

export function onManager(id) {
  return {
    type : ON_MANAGER,
    id,
  };
}

export function onAgent(id) {
  return {
    type : ON_AGENT,
    id,
  };
}

export function onState(state) {
  return {
    type : ON_STATE,
    state,
  };
}

