import client from 'backend/es/connection';

import {
  userHasRoleAny,
  Role_ADMINISTRATORS,
  Role_AGENTS,
  Role_CLIENTS,
  Role_INSURERS,
} from 'roles';

import { DocType } from 'data/types';

const log = require('log')('app:backend:es:onDoc');

export default function onDoc(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await new Parse.Query(DocType).get(id);

      client.index({
        index: 'fikrat',
        type: 'doc',
        id: doc.get('refNo'),
        body: {
          refNo        : doc.get('refNo'),
          vehicle      : doc.get('vehicle'),
          state        : doc.get('state'),
          date         : doc.get('date'),
          lastModified : doc.get('updatedAt'),
          agent        : await indexedUser(doc.get('agent'), /* isEmployee = */true),
          client       : await indexedUser(doc.get('client')),
          insurer      : await indexedUser(doc.get('insurer')),
          user         : await indexedUser(doc.get('user'), /* isEmployee = */true),
          validation   : await getValidation(doc),
          closure      : await getClosure(doc),
        }
      }, function (error, response) {
        if (error) {
          log.error(`Error indexing doc ${id}`, error);
          return reject(error);
        }

        log(`Successfully indexed doc ${id}`);
        return resolve(response);
      });
    } catch(e) {
      log.error(`Doc not found: ${id}`, e);
      reject(e);
    }
  });
}

function indexedUser(user, isEmployee = false) {
  if (user) {
    return user.fetch({ useMasterKey: true }).then(user => ({
      id: user.id,
      name: user.get('displayName'),
      email: user.get('email'),
      ...(isEmployee ? {
        type         : getType(user),
        isAdmin      : (user.get('roles') || []).indexOf(Role_ADMINISTRATORS) !== -1,
      } : {}),
    })).catch(() => null);
  }

  return Promise.resolve(null);
}

async function getValidation(doc) {
  if (doc.validation) {
    return {
      ...doc.validation,
      user : await new Parse.Query(Parse.User).get(doc.validation.user),
    };
  }

  return null;
}


async function getClosure(doc) {
  if (doc.closure) {
    return {
      ...doc.closure,
      user : await new Parse.Query(Parse.User).get(doc.closure.user),
    };
  }

  return null;
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

