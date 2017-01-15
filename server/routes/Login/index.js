import { PATH_LOGIN } from 'vars';

import { onEnter } from 'authWrappers/NotAuthenticated';

import Login from 'routes/Login/containers/LoginContainer';

export default (store) => ({
  path: PATH_LOGIN,
  getComponent(nextState, cb) {
    cb(null, Login);
  },
  onEnter: onEnter(store),
});

