import Parse from 'parse/node';

import { formatError, serializeParseObject } from 'backend/utils';

import * as codes from 'result-codes';

import { DocType, ActivityType } from 'data/types';

export default async function delPay(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const {
    id,
  } = request.params;

  try {
    const doc = await new Parse.Query(DocType).get(id, { useMasterKey: true });
    if (doc) {
      await doc.set({
        payment_user: null,
        payment_date: null,
        payment_at: null,
        payment_amount: null,
      }).save(null, { useMasterKey: true });

      const newDoc = await new Parse.Query(DocType)
        .include([
          'manager',
          'client',
          'agent',
          'user',
          'payment_user',
          'closure_user',
        ])
        .get(doc.id, { useMasterKey : true });

      done(null, {
        doc        : serializeParseObject(newDoc),
        activities : [],
      });
    } else {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }
  } catch (e) {
    done(formatError(e));
  }
}

