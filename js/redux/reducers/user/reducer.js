import getCurrentUser from 'getCurrentUser';

import { Record, List } from 'immutable';

import { Role_ADMINISTRATORS, Role_MANAGERS, Role_CLIENTS, Role_AGENTS, userHasRoleAll } from 'roles';

import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

import { INIT } from 'vars';

export class User extends Record({
  loading       : false,
  id            : undefined,
  displayName   : undefined,
  email         : undefined,
  emailVerified : true,
  roles         : List.of(),
  sessionToken  : undefined,
}) {
  get isEmpty() {
    return typeof this.id === 'undefined';
  }

  get isAdmin() {
    return userHasRoleAll(this, Role_ADMINISTRATORS);
  }

  get isAdminOrManager() {
    return userHasRoleAll(this, Role_ADMINISTRATORS) || userHasRoleAll(this, Role_MANAGERS);
  }

  isManager(doc) {
    if (doc && doc.manager) {
      return doc.manager.id === this.id;
    }
    return false;
  }

  isSelf(user) {
    return user
      ? this.id === user.id
      : false;
  }

}

function maybeUser() {
  const user = getCurrentUser();
  return user ? {
    id            : user.id,
    displayName   : user.get('displayName'),
    email         : user.get('email'),
    emailVerified : user.get('emailVerified'),
    roles         : user.get('roles') || [],
    sessionToken  : user.get('sessionToken'),
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

