import keyOf from 'keyOf';

export const Role_ADMINISTRATORS = keyOf({ADMINISTRATORS: null});

export const Role_CLIENTS = keyOf({CLIENTS: null});

export const Role_AGENTS = keyOf({AGENTS: null});

export const Role_INSURERS = keyOf({INSURERS: null});

export function userHasRoleAny(user: { roles: Array<String> }, ...roleNames: String): boolean {
  return roleNames.some((roleName) => user.roles.indexOf(roleName) !== -1);
}

export function userHasRoleAll(user: { roles: Array<String> }, ...roleNames: String): boolean {
  return roleNames.every((roleName) => user.roles.indexOf(roleName) !== -1);
}

