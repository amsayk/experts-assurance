import Parse from 'parse/node';

import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';

import { Role_MANAGERS } from 'roles';

export default async function signUp(request, done) {
  const {
    displayName,
    email,
    password,
    locale,
  } = request.params;

  try {
    const business = await getOrCreateBusiness();

    const ACL = new Parse.ACL();
    ACL.setPublicReadAccess(false);
    ACL.setPublicWriteAccess(false);

    const user = await new Parse.User()
      .setACL(ACL)
      .set({
        displayName,
        password,
        email,
        username: email,
        locale,
        roles: [Role_MANAGERS],
        business,
      }).signUp(null, { useMasterKey: true });

    done(null, serializeParseObject(user));
  } catch (e) {
    done(formatError(e));
  }
}

