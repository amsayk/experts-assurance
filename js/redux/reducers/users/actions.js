import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
  TOGGLE_SEARCH,
  ON_SEARCH,
  ON_ROLES,
} from './constants';

// Selection
import { set, add } from 'redux/reducers/selection/actions';
export const setSelection = set('users');
export const addToSelection = add('users');

// Sorting
import { sort, sortKey, sortDirection } from 'redux/reducers/sorting/actions';
export const sortUsers = sort('users');
export const sortUsersByKey = sortKey('users');
export const sortUsersByDirection = sortDirection('users');

export function search(queryString) {
  return {
    type  : ON_SEARCH,
    queryString,
  };
}

export function roles(roles) {
  return {
    type : ON_ROLES,
    roles,
  };
}

export function viewTypeGrid() {
  return {
    type: VIEW_TYPE_GRID,
  };
}
export function viewTypeList() {
  return {
    type: VIEW_TYPE_LIST,
  };
}

export function toggleSearch() {
  return {
    type: TOGGLE_SEARCH,
  };
}

