import Parse from 'parse/node';

import publish from 'backend/kue-mq/publish';

import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';

import { DOC_ID_KEY, DOC_FOREIGN_KEY } from 'backend/constants';

import * as codes from 'result-codes';

import { DocType, ActivityType } from 'data/types';

export default async function setManager(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const {
    id,
    manager, // ID!
  } = request.params;

  try {
    const doc = await new Parse.Query(DocType)
      .equalTo(DOC_ID_KEY, id)
      .first({ useMasterKey: true });

    if (!doc) {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }

    const oldManager = doc.get('manager');

    const user = await new Parse.Query(Parse.User)
      .get(manager, { useMasterKey: true });
    if (!user) {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }

    await doc.set({
      manager : user,

      [`lastModified_${request.user.id}`] : new Date(request.now),
      lastModified : new Date(request.now),
    }).save(null, { useMasterKey: true });

    const activities = [
      {
        type     : 'DOCUMENT_MANAGER_CHANGED',
        user     : request.user,
        date     : new Date(request.now),
        metadata : {
          fromManager : oldManager ? oldManager.id : null,
          toManager   : user.id,
        },
      },
    ];

    const objects = activities.map(({ type, date, user, metadata }) => {
      return new ActivityType().set({
        ns                : 'DOCUMENTS',
        type              : type,
        metadata          : { ...metadata },
        timestamp         : date,
        now               : new Date(request.now),
        [DOC_FOREIGN_KEY] : doc.get(DOC_ID_KEY),
        business          : request.user.get('business'),
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
      manager    : serializeParseObject(user),
      activities : newActivities.map(serializeParseObject),
    });

  } catch (e) {
    done(formatError(e));
  }
}

