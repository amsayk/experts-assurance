import getCurrentUser from 'getCurrentUser';

import { Record } from 'immutable';

import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

import { INIT } from 'vars';

class User extends Record({ id: undefined, email: undefined }) {
  isEmpty() {
    return typeof this.id === 'undefined';
  }
}

function maybeUser() {
  const user = getCurrentUser();
  return user ? {
    id: user.id,
    email: user.get('email'),
  } : {};
}

const initialState = new User();

export default function userReducer(state = initialState, { type, payload }) {
  if (type === USER_LOGGED_IN) {
    return new User(payload);
  }
  if (type === USER_LOGGED_OUT) {
    return initialState;
  }
  if (type === INIT) {
    return new User(maybeUser());
  }
  return state;
}

