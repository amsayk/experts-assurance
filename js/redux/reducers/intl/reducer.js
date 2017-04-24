import { DEFAULT_LANG } from 'vars';

import {
  UPDATE,
} from './constants';

import { Record } from 'immutable';

export class IntlState extends Record({
  defaultLocale   : DEFAULT_LANG,
  locale          : DEFAULT_LANG,
  messages        : {},
  formats         : {},
}) {
}

export const initialState = new IntlState();

export default function reducer(state = initialState, action) {
  if (action.type !== UPDATE) {
    return state
  }

  return state.merge(action.payload)
}

