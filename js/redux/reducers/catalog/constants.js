import keyOf from 'keyOf';

import {
  ACTION as SORT_ACTION,
} from 'redux/reducers/sorting/constants';

import {
  ACTION as SELECTION_ACTION,
} from 'redux/reducers/selection/constants';

// ------------------------------------
// Constants
// ------------------------------------

// view
export const VIEW_TYPE_LIST = keyOf({CATALOG_VIEW_TYPE_LIST: null});
export const VIEW_TYPE_GRID = keyOf({CATALOG_VIEW_TYPE_GRID: null});

export const START_ADDING = keyOf({CATALOG_START_ADDING: null});
export const STOP_ADDING  = keyOf({CATALOG_STOP_ADDING: null});

export const TOGGLE_SEARCH = keyOf({CATALOG_TOGGLE_SEARCH: null});
export const TOGGLE_SIDE_MENU = keyOf({CATALOG_TOGGLE_SIDE_MENU: null});

export const SORT = keyOf({[`${SORT_ACTION}/catalog`]: null});
export const SELECTION = keyOf({[`${SELECTION_ACTION}/catalog`]: null});

