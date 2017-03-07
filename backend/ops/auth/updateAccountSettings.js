import { formatError } from 'backend/utils';

export default async function updateAccountSettings(request, response) {
  const { payload: {
    displayName,
  } } = request.params;

  if (!request.user) {
    response.error(new Error('A user is required.'));
    return;
  }

  try {
    const user = await request.user.set({
      displayName,
    }).save(null, { sessionToken: request.user.getSessionToken() });
    response.success(user);
  } catch (e) {
    response.error(formatError(e));
  }
}

