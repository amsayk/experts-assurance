import Parse from 'parse/node';

import {
  formatError,
  getOrCreateBusiness,
  serializeParseObject,
} from 'backend/utils';

import { DOC_ID_KEY, DOC_FOREIGN_KEY } from 'backend/constants';

import * as codes from 'result-codes';

import { FileType, ActivityType } from 'data/types';

export default (async function restoreFile(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const { id } = request.params;

  try {
    const file = await new Parse.Query(FileType).get(id, { useMasterKey: true });

    if (file) {
      await file
        .unset('deletion_user')
        .unset('deletion_date')
        .save(null, { useMasterKey: true });

      const activities = [
        {
          type: 'FILE_RESTORED',
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

      const [newFile, newActivities] = await Promise.all([
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
