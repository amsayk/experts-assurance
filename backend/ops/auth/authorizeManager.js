import Parse from 'parse/node';

import { formatError, serializeParseObject } from 'backend/utils';

import codes from 'result-codes';

const log = require('log')('app:backend:authorizeManager');

export default async function authorizeManager(request, done) {
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
        authorization_date : new Date(request.now),
        authorization_user : request.user,
      }).save(null, { useMasterKey : true });
      done(null, { user : serializeParseObject(user) });
    } else {
      done(new Error(codes.ERROR_ILLEGAL_OPERATION));
    }
  } catch (e) {
    log.error(e);
    done(formatError(e));
  }
}

