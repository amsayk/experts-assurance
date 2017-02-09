import cookie from 'react-cookie';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
  START_ADDING,
  STOP_ADDING,
  TOGGLE_SEARCH,
  TOGGLE_SIDE_MENU,

  SELECTION,
  SORT,
} from './constants';

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

export class CatalogState extends Record({
  selection    : selectionInitialState,
  sortConfig   : sortInitialState,
  viewType     : VIEW_TYPE_GRID,
  adding       : false,
  sideMenuOpen : false,
  searchOpen   : false,
}) {}

const initialState = new CatalogState();

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
    case START_ADDING: {
      return state.merge({
        adding: true,
      });
    }
    case STOP_ADDING: {
      return state.merge({
        adding: false,
      });
    }
    case TOGGLE_SEARCH: {
      return state.merge({
        searchOpen: !state.searchOpen,
      });
    }
    case TOGGLE_SIDE_MENU: {
      return state.merge({
        sideMenuOpen: !state.sideMenuOpen,
      });
    }
    case INIT: {
      return state.merge({
        viewType   : cookie.load('viewType', /* doNotParse = */true) || VIEW_TYPE_GRID,
        sortConfig : sortInitialState.merge(cookie.load('catalog.sortConfig', /* doNotParse = */false)),
      });
    }
    default:
      return state;
  }
}

