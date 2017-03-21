import keyOf from 'keyOf';

import {
  ACTION as SORT_ACTION,
} from 'redux/reducers/sorting/constants';

export const ON_TEXT_INPUT         = keyOf({DOC_SEARCH_ON_TEXT_INPUT: null});
export const ON_STATE              = keyOf({DOC_SEARCH_ON_STATE: null});
export const TOGGLE_ADVANCED_MODE  = keyOf({DOC_SEARCH_TOGGLE_ADVANCED_MODE: null});
export const TOGGLE_SEARCH         = keyOf({DOC_SEARCH_TOGGLE_SEARCH: null});
export const ON_CLEAR              = keyOf({DOC_SEARCH_ON_CLEAR: null});
export const MERGE                 = keyOf({DOC_SEARCH_MERGE: null});

export const SORT                  = keyOf({[`${SORT_ACTION}/docSearch`]: null});

