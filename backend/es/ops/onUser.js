import client from 'backend/es/connection';

import {
  userHasRoleAny,
  Role_ADMINISTRATORS,
  Role_AGENTS,
  Role_CLIENTS,
  Role_INSURERS,
} from 'roles';

const log = require('log')('app:backend:es:onUser');

export default function onUser(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await new Parse.Query(Parse.User).get(id);

      client.index({
        index: 'fikrat',
        type: 'person',
        id,
        body: {
          name         : user.get('displayName'),
          email        : user.get('email'),
          username     : user.get('username'),
          type         : getType(user),
          isAdmin      : (user.get('roles') || []).indexOf(Role_ADMINISTRATORS) !== -1,
          date         : user.get('createdAt'),
          lastModified : user.get('updatedAt'),
        }
      }, function (error, response) {
        if (error) {
          log.error(`Error indexing user ${id}`, error);
          return reject(error);
        }

        log(`Successfully indexed user ${id}`);
        return resolve(response);
      });
    } catch(e) {
      log.error(`User not found: ${id}`, e);
      reject(e);
    }
  });
}

function getType(user) {
  const roles = user.get('roles') || [];

  if (userHasRoleAny({ roles }, Role_ADMINISTRATORS, Role_AGENTS)) {
    return 'EMPLOYEE';
  }

  if (userHasRoleAny({ roles }, Role_CLIENTS)) {
    return 'CLIENT';
  }

  if (userHasRoleAny({ roles }, Role_INSURERS)) {
    return 'INSURER';
  }

  return null;
}
