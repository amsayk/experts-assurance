import cookie from 'react-cookie';

import {
  SELECTION,
  SORT,

  ON_SEARCH,
  ON_STATE,
  ON_CLIENT,
  ON_MANAGER,
  ON_AGENT,
} from './constants';

import { USER_LOGGED_OUT, USER_LOGGED_IN } from 'redux/reducers/user/constants';

import { INIT } from 'vars';

// selection
import selectionReducer, {
  initialState as selectionInitialState,
} from 'redux/reducers/selection/reducer';

// sort
import sortReducer, {
  initialState as sortInitialState,
} from 'redux/reducers/sorting/reducer';

import { Record } from 'immutable';

const initialSortConfig = sortInitialState.merge({ key : 'dateMission' });

export class CasesState extends Record({
  selection    : selectionInitialState,
  sortConfig   : initialSortConfig,
  queryString  : '',
  state        : null,
  client       : null,
  manager      : null,
  agent        : null,
}) {}

const initialState = new CasesState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECTION: {
      return state.merge({
        selection: selectionReducer(state.selection, action.payload),
      });
    }
    case SORT: {
      return state.merge({
        sortConfig: sortReducer(state.sortConfig, action.payload),
      });
    }
    case ON_SEARCH: {
      return state.merge({
        queryString: action.queryString,
      });
    }
    case ON_STATE: {
      return state.merge({
        state: action.state,
      });
    }
    case ON_CLIENT: {
      return state.merge({
        client: action.id,
      });
    }
    case ON_MANAGER: {
      return state.merge({
        manager: action.id,
      });
    }
    case ON_AGENT: {
      return state.merge({
        agent: action.id,
      });
    }

      case USER_LOGGED_IN:
    case INIT: {
      return state.merge({
        sortConfig : initialSortConfig.merge(cookie.load('cases.sortConfig', /* doNotParse = */false)),
      });
    }
    case USER_LOGGED_OUT:
      return action.manual ? initialState : state;
    default:
      return state;
  }
}

