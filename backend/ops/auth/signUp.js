import { formatError, getOrCreateBusiness } from 'backend/utils';

import { CLIENTS } from 'roles';

export default async function signUp(request, response) {
  const { email, password, locale, role } = request.params;

  try {
    const business = await getOrCreateBusiness();
    const user = await new Parse.User()
      .set({
        password,
        email,
        username: email,
        locale,
        roles: [role || CLIENTS],
        business,
      }).signUp(null, { useMasterKey: true });

    response.success(user);
  } catch (e) {
    response.error(formatError(e));
  }
}

