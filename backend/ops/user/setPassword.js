import { formatError } from 'backend/utils';

export default async function setPassword(request, response) {
  const { payload: { newPassword } } = request.params;

  if (!request.user) {
    response.error(new Error('A user is required.'));
    return;
  }

  try {
    await request.user.set('password', newPassword)
      .save(null, { sessionToken: request.user.getSessionToken() });
    response.success({});
  } catch (e) {
    response.error(formatError(e));
  }
}

