import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
  START_ADDING,
  STOP_ADDING,
  TOGGLE_SEARCH,
} from './constants';

import { INIT } from 'vars';

// selection
import selectionReducer, {
  initialState as selectionInitialState,
} from 'redux/reducers/selection/reducer';

import {
  ACTION as selectionAction,
} from 'redux/reducers/selection/constants';

import { Record } from 'immutable';

class CatalogState extends Record({
  selection  : selectionInitialState,
  viewType   : VIEW_TYPE_GRID,
  adding     : false,
  searchOpen : false,
}) {}

const initialState = new CatalogState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case selectionAction: {
      if (action.selectionKey === 'catalog') {
        return state.merge({
          selection: selectionReducer(state.selection, action.payload),
        });
      }
      return state;
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
    case INIT: {
      return initialState;
    }
    default:
      return state;
  }
}

