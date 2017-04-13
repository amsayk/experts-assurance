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
export const VIEW_TYPE_LIST = keyOf({USERS_VIEW_TYPE_LIST: null});
export const VIEW_TYPE_GRID = keyOf({USERS_VIEW_TYPE_GRID: null});

export const TOGGLE_SEARCH = keyOf({USERS_TOGGLE_SEARCH: null});

export const ON_SEARCH = keyOf({USERS_ON_SEARCH: null});
export const ON_ROLES  = keyOf({USERS_ON_ROLES: null});

export const SORT = keyOf({[`${SORT_ACTION}/users`]: null});
export const SELECTION = keyOf({[`${SELECTION_ACTION}/users`]: null});

