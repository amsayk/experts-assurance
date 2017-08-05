import Parse from 'parse/node';

import { formatError, serializeParseObject } from 'backend/utils';

import { DOC_FOREIGN_KEY, DOC_ID_KEY } from 'backend/constants';

import * as codes from 'result-codes';

import { DocType, ActivityType } from 'data/types';

export default (async function delMTRapports(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const { id } = request.params;

  try {
    const doc = await new Parse.Query(DocType)
      .equalTo(DOC_ID_KEY, id)
      .first({ useMasterKey: true });

    if (doc) {
      const oldValue = {
        amount: doc.get('validation_amount'),
      };

      await doc
        .set({
          validation_amount: null,
        })
        .save(null, { useMasterKey: true });

      const activities = [
        {
          type: 'MT_RAPPORTS_CHANGED',
          user: request.user,
          date: new Date(request.now),
          metadata: {
            deletion: true,
            fromValue: { ...oldValue },
            toValue: {
              amount: null,
            },
          },
        },
      ];

      const objects = activities.map(({ type, date, user, metadata }) => {
        return new ActivityType().set({
          ns: 'DOCUMENTS',
          type: type,
          metadata: { ...metadata },
          [DOC_FOREIGN_KEY]: doc.get(DOC_ID_KEY),
          timestamp: date,
          now: new Date(request.now),
          business: request.user.get('business'),
          user,
        });
      });

      await Promise.all(objects.map(o => o.save(null, { useMasterKey: true })));

      const [newDoc, newActivities] = await Promise.all([
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

        // activities
        new Parse.Query(ActivityType)
          .equalTo(DOC_FOREIGN_KEY, doc.get(DOC_ID_KEY))
          .include(['user'])
          .find({ useMasterKey: true }),
      ]);

      done(null, {
        doc: serializeParseObject(newDoc),
        activities: newActivities.map(serializeParseObject),
      });
    } else {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }
  } catch (e) {
    done(formatError(e));
  }
});
