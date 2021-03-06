import Parse from 'parse/node';

import config from 'build/config';

import client from 'backend/es/connection';

const log = require('log')('app:backend:es:onDocDeleted');

export default function onDocDeleted(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await new Parse.Query(DocType).get(id, { useMasterKey : true });

      client.delete({
        index   : config.esIndex,
        type    : 'doc',
        id      : doc.get('refNo'),
        refresh : 'true',
      }, function (error, response) {
        if (error) {
          log.error(`Error deleting doc ${id} from index`, error);
          return reject(error);
        }

        log(`Successfully deleted doc ${id} from index`);
        return resolve(response);
      });
    } catch(e) {
      log.error(`Doc not found: ${id}`, e);
      reject(e);
    }
  });
}

