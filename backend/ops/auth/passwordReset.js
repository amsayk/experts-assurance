const log = require('log')('app:backend:passwordReset');

export default async function passwordReset(request, response) {
  response.success({}); // success always.
  try {
    const { email } = request.params;
    await Parse.User.requestPasswordReset(email);
  } catch (e) {
    log.error(e);
  }
}

