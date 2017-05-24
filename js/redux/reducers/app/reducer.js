import cookie from 'react-cookie';

import {
  READY,
  RESIZE,
  CONNECTION_STATE_CHANGE,
  TOGGLE_ALERTS,

  ADD_DOC,
  CLOSE_DOC,
} from './constants';

import { INIT } from 'vars';

import { SERVER } from 'vars';

import { Record } from 'immutable';

const MEDIA_QUERY = '(min-width: 992px)';
const TIMELINE_MEDIA_QUERY = '(min-width: 1232px)';

export class AppState extends Record({
  displayMatches         : SERVER || matchMedia(MEDIA_QUERY).matches,
  timelineDisplayMatches : SERVER || matchMedia(TIMELINE_MEDIA_QUERY).matches,
  onLine                 : true,
  isReady                : false,
  alertsOpen             : false,
  addingDoc              : false,
  closingDoc             : false,
}) {}

const initialState = new AppState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_DOC:
      return state.merge({
        addingDoc: action.addingDoc,
      });
    case CLOSE_DOC:
      return state.merge({
        closingDoc: action.closingDoc,
      });
    case RESIZE:
      return state.merge({
        displayMatches: matchMedia(MEDIA_QUERY).matches,
        timelineDisplayMatches: matchMedia(TIMELINE_MEDIA_QUERY).matches,
      });
    case CONNECTION_STATE_CHANGE:
      return state.merge({
        onLine: action.isConnected,
      });
    case READY:
      return state.merge({
        isReady: true,
      });
    case TOGGLE_ALERTS:
      return state.merge({
        alertsOpen: !state.alertsOpen,
      });
    case INIT: {
      return state.merge({
        displayMatches         : SERVER || matchMedia(MEDIA_QUERY).matches,
        timelineDisplayMatches : SERVER || matchMedia(TIMELINE_MEDIA_QUERY).matches,
      });
    }
    default:
      return state;
  }
}

