import Parse from 'parse/node';

import publish from 'backend/kue-mq/publish';

import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';

import * as codes from 'result-codes';

import { DocType, ActivityType } from 'data/types';

export default async function delDoc(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const {
    id,
  } = request.params;

  try {
    const doc = await new Parse.Query(DocType).get(id);
    if (doc) {
      await doc.set({
        deletion_user: request.user,
        deletion_date: new Date(request.now),
      }).save(null, { useMasterKey: true });

      const activities = [
        { type : 'DOCUMENT_DELETED', user: request.user, date: new Date(request.now) },
      ];

      const objects = activities.map(({ type, date, user, ...metadata }) => {
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

      await Promise.all(objects.map((o) => o.save(null, { useMasterKey : true })));

      setTimeout(() => {
        // publish to es_index
        const req = {
          user   : request.user,
          now    : request.now,
          params : { id: doc.id },
        };
        publish('ES_INDEX', 'onDocDeleted', req);
      }, 0);

      const [ newDoc, newActivities ] = await Promise.all([
        // new doc
        new Parse.Query(DocType)
        .include([
          'manager',
          'client',
          'agent',
          'user',
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
    } else {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }
  } catch (e) {
    done(formatError(e));
  }
}

