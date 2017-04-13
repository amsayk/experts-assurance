import Parse from 'parse/node';

import publish from 'backend/kue-mq/publish';

import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';

import codes from 'result-codes';

import { DocType, ActivityType } from 'data/types';

export default async function setManager(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const { payload: {
    id,
    manager, // ID!
  } } = request.params;

  try {
    const doc = await new Parse.Query(DocType)
      .get(id);
    if (!doc) {
      done(new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND));
      return;
    }

    const oldManager = doc.get('manager');

    const user = await new Parse.Query(Parse.User)
      .get(manager);
    if (!user) {
      done(new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND));
      return;
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
        ns        : 'DOCUMENTS',
        type      : type,
        metadata  : { ...metadata },
        timestamp : date,
        document  : doc,
        business  : request.user.get('business'),
        user,
      });
    });

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
      manager : serializeParseObject(manager),
    });
  } catch (e) {
    done(formatError(e));
  }
}

