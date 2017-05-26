import {
  ON_STATE,
  ON_TEXT_INPUT,
  TOGGLE_ADVANCED_MODE,
  TOGGLE_SEARCH,
  ON_CLEAR,
  MERGE,

  SORT,
} from './constants';

import { USER_LOGGED_OUT } from 'redux/reducers/user/constants';

import { Record } from 'immutable';

// sort
import sortReducer, {
  initialState as sortInitialState,
} from 'redux/reducers/sorting/reducer';

export class DocSearchState extends Record({
  active          : false,
  showStateFilter : false,

  q               : '',
  state           : null,
  advancedMode    : false,

  manager         : null,
  client          : null,
  agent           : null,

  validator       : null,
  closer          : null,
  user            : null,

  range           : null,
  // validationRange : null,
  closureRange    : null,

  lastModified    : null,

  vehicleModel    : null,
  vehicleManufacturer    : null,

  sortConfig      : sortInitialState,
}) {}

const initialState = new DocSearchState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case MERGE: {
      return state.merge(action.opts);
    }
    case SORT: {
      return state.merge({
        sortConfig: sortReducer(state.sortConfig, action.payload),
      });
    }
    case ON_STATE: {
      return state.merge({
        state           : action.state,
        showStateFilter : ! !!action.state,
        active          : true,
      });
    }
    case ON_TEXT_INPUT: {
      return state.merge({
        q : action.q,
      });
    }
    case TOGGLE_ADVANCED_MODE: {
      return state.merge({
        advancedMode    : ! state.advancedMode,
        showStateFilter : false,
        active          : true,
      });
    }
    case TOGGLE_SEARCH: {
      return state.merge({
        active          : action.active === null ? ! state.active                       : action.active,
        showStateFilter : action.active === null ? ! state.active                       : action.active,
        advancedMode    : state.advancedMode ? (action.active === null ? ! state.active : action.active) : state.advancedMode,
      });
    }
    case ON_CLEAR: {
      return initialState;
    }
    case USER_LOGGED_OUT:
      return action.manual ? initialState : state;
    default:
      return state;
  }
}

