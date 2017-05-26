import Parse from 'parse/node';

import publish from 'backend/kue-mq/publish';

import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';

import { DocType, ActivityType } from 'data/types';

import * as codes from 'result-codes';

export default async function closeDoc(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const {
    id,
    info : {
      dateClosure : dateClosureMS,
      paymentAmount,
      paymentDate : paymentDateMS,
    },
  } = request.params;

  try {
    const doc = await new Parse.Query(DocType)
      .get(id, { useMasterKey: true });
    if (!doc) {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }

    const oldState = doc.get('state');

    let paymentInfo = {

    };

    const current_payment_date = doc.has('payment_date') && doc.get('payment_amount').getTime ? doc.get('payment_date').getTime() : null;
    const current_payment_amount = doc.has('payment_amount') ? doc.get('payment_amount') : null;
    if (current_payment_amount !== paymentAmount || current_payment_date !== paymentDateMS) {
      paymentInfo = {
        payment_user   : request.user,
        payment_date   : new Date(paymentDateMS),
        payment_amount : paymentAmount,

      };
    }

    await doc.set({
      state : 'CLOSED',

      ...paymentInfo,

      [`lastModified_${request.user.id}`] : new Date(request.now),
      lastModified : new Date(request.now),
    }).save(null, { useMasterKey: true });

    const activities = [
      {
        type     : 'DOCUMENT_STATE_CHANGED',
        metadata : {
          fromState : oldState,
          toState   : 'CLOSED',
        },
        date     : new Date(request.now),
        user     : request.user,
      },
    ];

    const closure = {
      date  : new Date(dateClosureMS),
      state : 'CLOSED',
      user  : request.user,
    };

    const objects = activities.map(({ type, date, user, metadata }) => {
      return new ActivityType().set({
        ns        : 'DOCUMENTS',
        type      : type,
        metadata  : { ...metadata },
        timestamp : date,
        document  : doc,
        business  : request.user.get('business'),
        user,
      });
    });


    doc.set({
      closure_user  : closure.user,
      closure_state : closure.state,
      closure_date  : closure.date,
    });

    objects.push(doc);

    await Promise.all(objects.map((o) => o.save(null, { useMasterKey : true })));

    setTimeout(() => {
      // publish to es_index
      const req = {
        user   : request.user,
        now    : request.now,
        params : { id: doc.id },
      };
      publish('ES_INDEX', 'onDoc', req);
    }, 0);

    const [ newDoc, newActivities ] = await Promise.all([
      // new doc
      new Parse.Query(DocType)
      .include([
        'manager',
        'client',
        'agent',
        'user',
        'payment_user',
        'validation_user',
        'closure_user',
      ])
      .get(doc.id, { useMasterKey : true }),

      // activities
      new Parse.Query(ActivityType)
      .equalTo('document', doc)
      .include([
        'document',
        'user',
      ])
      .find({ useMasterKey : true })
    ]);

    done(null, {
      doc        : serializeParseObject(newDoc),
      activities : newActivities.map(serializeParseObject),
    });

  } catch (e) {
    done(formatError(e));
  }
}
