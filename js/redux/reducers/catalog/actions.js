import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
  START_ADDING,
  STOP_ADDING,
  TOGGLE_SEARCH,
} from './constants';

import { toggleKey } from 'redux/reducers/selection/actions';

export const toggleProductSelection = toggleKey('catalog');

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

