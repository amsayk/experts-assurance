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

import { DocType } from 'data/types';

const log = require('log')('app:backend:es:onDoc');

export default function onDoc(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await new Parse.Query(DocType).get(id, { useMasterKey : true });

      const lastModifiedFields = Object.keys(doc.attributes)
        .filter((key) => key.startsWith('lastModified_'))
        .reduce((memo, key) => {
          memo[key] = doc.get(key);
          return memo;
        }, {});

      client.index({
        index: config.esIndex,
        type: 'doc',
        id: doc.get('refNo'),
        body: {
          id           : doc.id,
          refNo        : doc.get('refNo'),
          vehicle      : doc.get('vehicle'),
          state        : doc.get('state'),
          company      : doc.get('company'),
          dateMission  : doc.get('dateMission'),
          date         : doc.get('date'),
          manager      : doc.has('manager') ? (await indexedUser(doc.get('manager'), /* isEmployee = */true)) : null,
          client       : (await indexedUser(doc.get('client'))),
          agent        : (await indexedUser(doc.get('agent'))),
          user         : (await indexedUser(doc.get('user'), /* isEmployee = */true)),
          lastModified : doc.get('lastModified') || doc.get('updatedAt'),
          police       : doc.get('police'),
          nature       : doc.get('nature'),
          ...lastModifiedFields,
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
    } catch (e) {
      log.error(`Doc not found: ${id}`, e);
      reject(e);
    }
  });
}

async function indexedUser(user, isEmployee = false) {
  if (user) {
    try {
      return await user.fetch({ useMasterKey: true }).then((user) => ({
        id           : user.id,
        name         : user.get('displayName'),
        email        : user.get('email') || user.get('mail'),
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
  const validation_amount = doc.get('validation_amount');
  const validation_user = doc.get('validation_user');

  if (validation_user) {
    const isEmployee = (validation_user.get('roles') || []).indexOf(Role_ADMINISTRATORS) !== -1 || (validation_user.get('roles') || []).indexOf(Role_MANAGERS) !== -1;
    return {
      validation_amount,
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
    const isEmployee = (closure_user.get('roles') || []).indexOf(Role_ADMINISTRATORS) !== -1 || (closure_user.get('roles') || []).indexOf(Role_MANAGERS) !== -1;
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

