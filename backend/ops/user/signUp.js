import { formatError } from 'backend/utils';

export default async function signUp(request, response) {
  const { email, password } = request.params;

  try {
    const user = await new Parse.User()
      .set({
        password,
        email,
        username: email,
      }).signUp(null, { useMasterKey: true });
    response.success(user);
  } catch (e) {
    response.error(formatError(e));
  }
}

