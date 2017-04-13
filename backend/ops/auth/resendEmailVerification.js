import Parse from 'parse/node';

import { formatError } from 'backend/utils';

export default async function resendVerificationEmail(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  request.user.set({ email: request.user.get('email') });
  try {
    await request.user.save(null, { sessionToken: request.user.getSessionToken() });
    done(null, {});
  } catch (e) {
    done(formatError(e));
  }
};

