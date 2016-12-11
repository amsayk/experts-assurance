import getCurrentUser from 'getCurrentUser';

import Immutable from 'immutable';

import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

function maybeUser() {
  const user = getCurrentUser();
  return user ? { id: user.id } : {};
}

const initialState = Immutable.fromJS(maybeUser());

export default function userReducer(state = initialState, { type, payload }) {
  if (type === USER_LOGGED_IN) {
    return Immutable.fromJS(payload);
  }
  if (type === USER_LOGGED_OUT) {
    return Immutable.fromJS({});
  }
  return state;
}

