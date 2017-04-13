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

export const ON_SEARCH  = keyOf({CASES_ON_SEARCH: null});
export const ON_STATE   = keyOf({CASES_ON_STATE: null});
export const ON_CLIENT  = keyOf({CASES_ON_CLIENT: null});
export const ON_MANAGER = keyOf({CASES_ON_MANAGER: null});
export const ON_AGENT   = keyOf({CASES_ON_AGENT: null});

export const SORT       = keyOf({[`${SORT_ACTION}/cases`]: null});
export const SELECTION  = keyOf({[`${SELECTION_ACTION}/cases`]: null});

