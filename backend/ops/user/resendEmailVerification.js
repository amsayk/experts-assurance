import { formatError } from 'backend/utils';

export default async function resendVerificationEmail(request, response) {
  if (!request.user) {
    response.error(new Error('A user is required.'));
    return;
  }

  request.user.set({ email: request.user.get('email') });
  try {
    await request.user.save(null, { sessionToken: request.user.getSessionToken() });
    response.success({});
  } catch (e) {
    response.error(formatError(e));
  }
};

