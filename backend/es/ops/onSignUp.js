import Parse from 'parse/node';

import client from 'backend/es/connection';

import config from 'build/config';

import {
  userHasRoleAny,
  Role_ADMINISTRATORS,
  Role_MANAGERS,
  Role_CLIENTS,
  Role_AGENTS,
} from 'roles';

const log = require('log')('app:backend:es:onSignUp');

export default function onSignUp(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await new Parse.Query(Parse.User).get(id, { useMasterKey : true });

      client.create({
        index: config.esIndex,
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

  if (userHasRoleAny({ roles }, Role_ADMINISTRATORS, Role_MANAGERS)) {
    return 'EMPLOYEE';
  }

  if (userHasRoleAny({ roles }, Role_CLIENTS)) {
    return 'CLIENT';
  }

  if (userHasRoleAny({ roles }, Role_AGENTS)) {
    return 'AGENT';
  }

  return 'CLIENT';
}

