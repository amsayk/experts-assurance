import Parse from 'parse/node';

import publish from 'backend/kue-mq/publish';

import { formatError, deserializeParseObject, serializeParseObject } from 'backend/utils';
import { DocType } from 'data/types';

import * as codes from 'result-codes';

export default async function purgeDoc(request, done) {
  const { id } = request.params;

  try {
    const doc = await new Parse.Query(DocType)
      .get(id, { useMasterKey: true }); // Use realID!

    if (!doc) {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }

    await doc.destroy();

    setTimeout(() => {
      // publish to es_index
      const req = {
        user   : serializeParseObject(request.user),
        now    : request.now,
        params : { id: doc.id },
      };
      publish('ES_INDEX', 'onDocDeleted', req);
    }, 0);

    const newDoc = await new Parse.Query(DocType)
      .include([
        'manager',
        'client',
        'agent',
        'user',
        'payment_user',
        'validation_user',
        'closure_user',
      ])
      .get(doc.id, { useMasterKey : true });

    done(null, {
      doc : serializeParseObject(newDoc),
    });

  } catch (e) {
    done(formatError(e));
  }
}

