import { formatError } from 'backend/utils';

export default async function changeEmail(request, response) {
  const { payload: { email } } = request.params;

  if (!request.user) {
    response.error(new Error('A user is required.'));
    return;
  }

  try {
    if (email !== request.user.get('email')) {
      const user = await request.user.set('email', email)
        .save(null, { sessionToken: request.user.getSessionToken() });
    }
    response.success(user);
  } catch (e) {
    response.error(formatError(e));
  }
}

