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
      const doc = await new Parse.Query(DocType).get(id, { useMasterKey : true });

      client.index({
        index: 'fikrat',
        type: 'doc',
        id: doc.get('refNo'),
        body: {
          id           : doc.id,
          refNo        : doc.get('refNo'),
          refNo_string : String(doc.get('refNo')),
          vehicle      : doc.get('vehicle'),
          state        : doc.get('state'),
          date         : doc.get('date'),
          lastModified : doc.get('updatedAt'),
          agent        : (await indexedUser(doc.get('agent'), /* isEmployee = */true)),
          client       : (await indexedUser(doc.get('client'))),
          insurer      : (await indexedUser(doc.get('insurer'))),
          user         : (await indexedUser(doc.get('user'), /* isEmployee = */true)),
          ...(await getValidation(doc)),
          ...(await getClosure(doc)),
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

async function indexedUser(user, isEmployee = false) {
  if (user) {
    try {
      return await user.fetch({ useMasterKey: true }).then(user => ({
        id           : user.id,
        name         : user.get('displayName'),
        email        : user.get('email'),
        type         : getType(user),
        isAdmin      : (user.get('roles') || []).indexOf(Role_ADMINISTRATORS) !== -1,
        date         : user.get('createdAt'),
        lastModified : user.get('updatedAt'),
      }));

    } catch (e) {
      log.error(`Error getting user ${user.id}`, e);
      return null;
    }
  }

  return null;
}

async function getValidation(doc) {
  const validation_date = doc.get('validation_date');
  const validation_user = doc.get('validation_user');

  if (validation_date && validation_user) {
    const isEmployee = (validation_user.get('roles') || []).indexOf(Role_ADMINISTRATORS) !== -1 || (validation_user.get('roles') || []).indexOf(Role_AGENTS) !== -1;
    return {
      validation_date,
      validation_user : (await indexedUser(validation_user, isEmployee)),
    };
  }

  return null;
}


async function getClosure(doc) {
  const closure_date = doc.get('closure_date');
  const closure_state = doc.get('closure_state');
  const closure_user = doc.get('closure_user');

  if (closure_date && closure_state && closure_user) {
    const isEmployee = (closure_user.get('roles') || []).indexOf(Role_ADMINISTRATORS) !== -1 || (closure_user.get('roles') || []).indexOf(Role_AGENTS) !== -1;
    return {
      closure_state,
      closure_date,
      closure_user : (await indexedUser(closure_user, isEmployee)),
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

  return 'CLIENT';
}

