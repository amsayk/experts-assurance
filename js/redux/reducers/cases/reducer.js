import cookie from 'react-cookie';

import {
  SELECTION,
  SORT,

  ON_SEARCH,
  ON_STATE,
  ON_CLIENT,
  ON_AGENT,
  ON_INSURER,
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

export class CasesState extends Record({
  selection    : selectionInitialState,
  sortConfig   : sortInitialState,
  queryString  : '',
  state        : null,
  client       : null,
  agent        : null,
  insurer      : null,
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
    case ON_AGENT: {
      return state.merge({
        agent: action.id,
      });
    }
    case ON_INSURER: {
      return state.merge({
        insurer: action.id,
      });
    }

    case INIT: {
      return state.merge({
        sortConfig : sortInitialState.merge(cookie.load('cases.sortConfig', /* doNotParse = */false)),
      });
    }
    default:
      return state;
  }
}

