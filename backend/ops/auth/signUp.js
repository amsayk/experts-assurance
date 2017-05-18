import Parse from 'parse/node';

import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';

import publish from 'backend/kue-mq/publish';

import { Role_MANAGERS } from 'roles';

export default async function signUp(request, done) {
  const {
    displayName,
    email,
    password,
    locale,
    role = Role_MANAGERS,
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
        roles: [role],
        business,
      }).signUp(null, { useMasterKey: true });

    setTimeout(() => {
      // publish to es_index
      const req = {
        user   : serializeParseObject(request.user),
        now    : request.now,
        params : { id: user.id },
      };
      publish('ES_INDEX', 'onSignUp', req);
    }, 0);

    done(null, serializeParseObject(user));
  } catch (e) {
    done(formatError(e));
  }
}

