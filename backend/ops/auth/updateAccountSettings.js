import Parse from 'parse/node';

import { formatError } from 'backend/utils';

export default async function updateAccountSettings(request, done) {
  const { payload: {
    displayName,
  } } = request.params;

  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  try {
    const user = await request.user.set({
      displayName,
    }).save(null, { sessionToken: request.user.getSessionToken() });
    done(null, serializeParseObject(user));
  } catch (e) {
    done(formatError(e));
  }
}

