import cookie from 'react-cookie';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
  TOGGLE_SEARCH,

  SELECTION,
  SORT,

  ON_ROLES,
  ON_SEARCH,
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

import { Record, List } from 'immutable';

const initialSortConfig = sortInitialState.merge({ key : 'date' });

export class UsersState extends Record({
  selection    : selectionInitialState,
  sortConfig   : initialSortConfig,
  viewType     : VIEW_TYPE_GRID,
  searchOpen   : false,
  queryString  : '',
  roles        : List.of(),
}) {}

const initialState = new UsersState();

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
    case VIEW_TYPE_LIST: {
      return state.merge({
        viewType: VIEW_TYPE_LIST,
      });
    }
    case VIEW_TYPE_GRID: {
      return state.merge({
        viewType: VIEW_TYPE_GRID,
      });
    }
    case TOGGLE_SEARCH: {
      return state.merge({
        searchOpen: !state.searchOpen,
      });
    }
    case ON_ROLES: {
      return state.merge({
        roles: List.of(...action.roles),
      });
    }
    case ON_SEARCH: {
      return state.merge({
        queryString: action.queryString,
      });
    }
    case USER_LOGGED_IN:
    case INIT: {
      return state.merge({
        viewType   : cookie.load('users.viewType', /* doNotParse = */true) || VIEW_TYPE_GRID,
        sortConfig : initialSortConfig.merge(cookie.load('users.sortConfig', /* doNotParse = */false)),
      });
    }
    case USER_LOGGED_OUT:
      return action.manual ? initialState : state;
    default:
      return state;
  }
}

