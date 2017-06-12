import Parse from 'parse/node';

import { formatError, serializeParseObject } from 'backend/utils';

export default async function changeEmail(request, done) {
  const { payload: { email } } = request.params;

  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  try {
    if (email !== request.user.get('email')) {
      const user = await request.user.set({
        email,
        mail : email,
      })
        .save(null, { sessionToken: request.user.getSessionToken() });
    }
    done(null, serializeParseObject(user));
  } catch (e) {
    done(formatError(e));
  }
}

