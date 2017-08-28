import Parse from 'parse/node';

import { formatError } from 'backend/utils';

export default (async function setPassword(request, done) {
  const { payload: { newPassword } } = request.params;

  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  try {
    await request.user
      .set({
        password: newPassword,
        changePasswordAtNextLogin: false,
      })
      .save(null, { sessionToken: request.user.getSessionToken() });
    done(null, {});
  } catch (e) {
    done(formatError(e));
  }
});
