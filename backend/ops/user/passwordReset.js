import { formatError } from '../utils';

export default async function passwordReset(request, response) {
  const { email } = request.params;
  try {
    await Parse.User.requestPasswordReset(email);
    response.success({});
  } catch (e) {
    response.error(formatError(e));
  }
}

