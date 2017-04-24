import Parse from 'parse/node';

import { formatError, serializeParseObject } from 'backend/utils';

import codes from 'result-codes';

const log = require('log')('app:backend:revokeManagerAuthorization');

export default async function revokeManagerAuthorization(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const {
    id,
  } = request.params;

  try {
    const user = await new Parse.Query(Parse.User).get(id);

    if (user) {
      await user.set({
        authorization_date : null,
        authorization_user : null,
      }).save(null, { useMasterKey : true });

      // const activities = await new Parse.Query(ActivityType)
      //   .equalTo('document', doc)
      //   .include([
      //     'document',
      //     'user',
      //   ])
      //   .find({ useMasterKey : true });

      done(null, {
        user       : serializeParseObject(user),
        activities : [], // activities.map(serializeParseObject),
      });

    } else {
      done(new Error(codes.ERROR_ILLEGAL_OPERATION));
    }
  } catch (e) {
    log.error(e);
    done(formatError(e));
  }
}


