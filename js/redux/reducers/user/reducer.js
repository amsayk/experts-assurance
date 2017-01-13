import getCurrentUser from 'getCurrentUser';

import { fromJS } from 'immutable';

import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

import { INIT } from 'vars';

function maybeUser() {
  const user = getCurrentUser();
  return user ? {
    id: user.id,
    email: user.get('email'),
  } : {};
}

const initialState = fromJS({});

export default function userReducer(state = initialState, { type, payload }) {
  if (type === USER_LOGGED_IN) {
    return fromJS(payload);
  }
  if (type === USER_LOGGED_OUT) {
    return fromJS({});
  }
  if (type === INIT) {
    return fromJS(maybeUser());
  }
  return state;
}

