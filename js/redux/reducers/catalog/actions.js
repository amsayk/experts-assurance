import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
  START_ADDING,
  STOP_ADDING,
  TOGGLE_SEARCH,
  TOGGLE_SIDE_MENU,
} from './constants';

// Selection
import { set, add } from 'redux/reducers/selection/actions';
export const setSelection = set('catalog');
export const addToSelection = add('catalog');

// Sorting
import { sort, sortKey, sortDirection } from 'redux/reducers/sorting/actions';
export const sortProducts = sort('catalog');
export const sortProductsByKey = sortKey('catalog');
export const sortProductsByDirection = sortDirection('catalog');

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

export function startAdding() {
  return {
    type: START_ADDING,
  };
}

export function stopAdding() {
  return {
    type: STOP_ADDING,
  };
}

export function toggleSideMenu() {
  return {
    type : TOGGLE_SIDE_MENU,
  };
}

