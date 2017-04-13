import Parse from 'parse/node';

import publish from 'backend/kue-mq/publish';

import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';

import { DocType, ActivityType } from 'data/types';

import codes from 'result-codes';

export default async function setState(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const { payload: {
    id,
    state,
  } } = request.params;

  try {
    const doc = await new Parse.Query(DocType)
      .get(id);
    if (!doc) {
      done(new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND));
      return;
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
        ns        : 'DOCUMENTS',
        type      : type,
        metadata  : { ...metadata },
        timestamp : date,
        document  : doc,
        business  : request.user.get('business'),
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

    await Parse.Object.saveAll(objects);

    setTimeout(() => {
      // publish to es_index
      const req = {
        user   : request.user,
        now    : request.now,
        params : { id: doc.id },
      };
      publish('ES_INDEX', 'onDoc', req);
    }, 0);

    done(null, {
      doc : serializeParseObject(doc),
    });
  } catch (e) {
    done(formatError(e));
  }
}


