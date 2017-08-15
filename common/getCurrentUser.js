const Parse = require(process.env.PARSE_MODULE_PATH);

import invariant from 'invariant';

export default function getCurrentUser() {
  return Parse.User.current();
}

getCurrentUser.sessionByToken = function(token) {
  invariant(token, 'Invalid token to getCurrentUser.sessionByToken');
  return new Parse.Query(Parse.Session)
    .equalTo('sessionToken', token)
    .include(['user'])
    .first({ useMasterKey: true });
};
