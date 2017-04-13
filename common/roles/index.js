import keyOf from 'keyOf';

import isEmpty from 'isEmpty';

export const Role_ADMINISTRATORS = keyOf({ADMINISTRATORS: null});

export const Role_CLIENTS = keyOf({CLIENTS: null});

export const Role_AGENTS = keyOf({AGENTS: null});

export const Role_MANAGERS = keyOf({MANAGERS: null});

export function userHasRoleAny(user: { roles: Array<String> }, ...roleNames: String): boolean {
  return roleNames.some((roleName) => getRoles(user).indexOf(roleName) !== -1);
}

export function userHasRoleAll(user: { roles: Array<String> }, ...roleNames: String): boolean {
  return roleNames.every((roleName) => getRoles(user).indexOf(roleName) !== -1);
}

export function userVerified(user) {
  return user.has('emailVerified') ? user.get('emailVerified') : true;
}

export function isAuthorized(user) {
  return !isEmpty(user.get ? user.get('authorization') : user.authorization);
}

function getRoles(s) {
  return (s.get ? s.get('roles') : s.roles) || [];
}

