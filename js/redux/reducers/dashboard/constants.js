import keyOf from 'keyOf';

import {
  ACTION as SORT_ACTION,
} from 'redux/reducers/sorting/constants';

// ------------------------------------
// Constants
// ------------------------------------

export const TOGGLE  = keyOf({DASHBOARD_ON_TOGGLE: null});
export const SET_DURATION  = keyOf({DASHBOARD_SET_DURATION: null});
export const SET_CATEGORY  = keyOf({DASHBOARD_SET_CATEGORY: null});
// export const TOGGLE_INCLUDE_CANCELED  = keyOf({DASHBOARD_TOGGLE_INCLUDE_CANCELED: null});

export const SORT_OPEN         = keyOf({[`${SORT_ACTION}/openDashboard`]: null});
export const SORT_UNPAID       = keyOf({[`${SORT_ACTION}/unpaidDashboard`]: null});
export const SORT_INVALID      = keyOf({[`${SORT_ACTION}/invalidDashboard`]: null});
// export const SORT_CLOSED       = keyOf({[`${SORT_ACTION}/closedDashboard`]: null});

// export const SET_ONLY_VALID_OPEN = keyOf({DASHBOARD_SET_ONLY_VALID_OPEN: null});

