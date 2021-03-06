import Parse from 'parse/node';

import {
  formatError,
  getOrCreateBusiness,
  serializeParseObject,
} from 'backend/utils';

import { DOC_ID_KEY, DOC_FOREIGN_KEY } from 'backend/constants';

import * as codes from 'result-codes';

import { ActivityType, FileType, DocType } from 'data/types';

export default (async function delFile(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const { id } = request.params;

  try {
    const file = await new Parse.Query(FileType).get(id, { useMasterKey: true });

    if (file) {
      await file
        .set({
          deletion_user: request.user,
          deletion_date: new Date(request.now),
        })
        .save(null, { useMasterKey: true });

      const doc = await new Parse.Query(DocType)
        .equalTo(DOC_ID_KEY, file.get(DOC_FOREIGN_KEY))
        .first({ useMasterKey: true });

      if (doc) {
        doc.remove('files', file.id);
        doc.set({
          [`lastModified_${request.user.id}`]: new Date(request.now),
          lastModified: new Date(request.now),
        });

        await doc.save(null, { useMasterKey: true });
      }

      const activities = [
        {
          type: 'FILE_DELETED',
          user: request.user,
          date: new Date(request.now),
        },
      ];

      const objects = activities.map(({ type, date, user, ...metadata }) => {
        return new ActivityType().set({
          ns: 'DOCUMENTS',
          type: type,
          metadata: { ...metadata },
          timestamp: date,
          now: new Date(request.now),
          [DOC_FOREIGN_KEY]: file.get(DOC_FOREIGN_KEY),
          file: file,
          business: request.user.get('business'),
          user,
        });
      });

      await Promise.all(objects.map(o => o.save(null, { useMasterKey: true })));

      const [newDoc, newFile, newActivities] = await Promise.all([
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
          .get(doc.id, { useMasterKey: true }),

        // new file
        new Parse.Query(FileType)
          .include(['fileObj', 'user'])
          .get(file.id, { useMasterKey: true }),

        // activities
        new Parse.Query(ActivityType)
          .equalTo('file', file)
          .include(['file', 'user'])
          .ascending('now')
          .find({ useMasterKey: true }),
      ]);

      done(null, {
        doc: serializeParseObject(newDoc),
        file: serializeParseObject(newFile),
        activities: newActivities.map(serializeParseObject),
      });
    } else {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }
  } catch (e) {
    done(formatError(e));
  }
});
