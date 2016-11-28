const Parse = require(process.env.PARSE_MODULE_PATH);

import {
  isServer
} from 'environment';

import cookie from 'react-cookie';

const CURRENT_USER_KEY = 'currentUser';

export default function getCurrentUser() {
  if (isServer) {
    const path = Parse.Storage.generatePath(CURRENT_USER_KEY);
    const user = cookie.load(path, /* doNotParse = */false);
    return user ? Parse.User.fromJSON(user) : null;
  }

  return Parse.User.current();
}

