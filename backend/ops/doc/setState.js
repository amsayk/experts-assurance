import Parse from 'parse/node';

import publish from 'backend/kue-mq/publish';

import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';

import { DocType, ActivityType } from 'data/types';

import { DOC_ID_KEY, DOC_FOREIGN_KEY } from 'backend/constants';

import * as codes from 'result-codes';

export default async function setState(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const {
    id,
    state,
  } = request.params;

  try {
    const doc = await new Parse.Query(DocType)
      .equalTo(DOC_ID_KEY, id)
      .first({ useMasterKey: true });

    if (!doc) {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }

    const oldState = doc.get('state');

    await doc.set({
      state,

      [`lastModified_${request.user.id}`] : new Date(request.now),
      lastModified : new Date(request.now),
    }).save(null, { useMasterKey: true });

    let closure;
    let validation;
    const activities = [
    ];

    if (state === 'OPEN') {
      validation = {
        date: new Date(request.now),
        user: request.user,
      };
      activities.push(
        {
          type     : 'DOCUMENT_STATE_CHANGED',
          metadata : {
            fromState : oldState,
            toState   : state,
          },
          date     : new Date(request.now),
          user     : request.user,
        },
      );
    } else if (state === 'CLOSED') {
      closure = {
        date: new Date(request.now),
        state,
        user: request.user,
      };
      activities.push(
        {
          type     : 'DOCUMENT_STATE_CHANGED',
          metadata : {
            fromState : oldState,
            toState   : state,
          },
          date     : new Date(request.now),
          user     : request.user,
        },
      );
    } else if (state === 'CANCELED') {
      closure = {
        date: new Date(request.now),
        state,
        user: request.user,
      };
      activities.push(
      {
        type     : 'DOCUMENT_STATE_CHANGED',
        metadata : {
          fromState : oldState,
          toState   : state,
        },
        date     : new Date(request.now),
        user     : request.user,
      },
      );
    }

    const objects = activities.map(({ type, date, user, metadata }) => {
      return new ActivityType().set({
        ns                : 'DOCUMENTS',
        type              : type,
        metadata          : { ...metadata },
        timestamp         : date,
        [DOC_FOREIGN_KEY] : doc.get(DOC_ID_KEY),
        business          : request.user.get('business'),
        now               : new Date(request.now),
        user,
      });
    });

    if (validation || closure) {
      if (validation) {
        doc.set({
          validation_user : validation.user,
          validation_date : validation.date,
        });

      }
      if (closure) {
        doc.set({
          closure_user  : closure.user,
          closure_state : closure.state,
          closure_date  : closure.date,
        });

      }
      objects.push(doc);
    }

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
      .equalTo(DOC_FOREIGN_KEY, doc.get(DOC_ID_KEY))
      .include([
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


