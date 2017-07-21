import {
  START_IMPORTING,
  FINISH_IMPORTING,

  STAGE,
} from './constants';

import { Record } from 'immutable';

export class ImportState extends Record({
  importing : false,
  stage     : null,

}) {}

const initialState = new ImportState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case START_IMPORTING:
      return state.merge({
        importing : true,
      });
    case FINISH_IMPORTING:
      return state.merge({
        importing : false,
      });
    case STAGE:
      return state.merge({
        stage : action.stage,
      });
    default:
      return state;
  }
}

