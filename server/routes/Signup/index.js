import { PATH_SIGNUP } from 'vars';

import { onEnter } from 'authWrappers/NotAuthenticated';

import Signup from 'routes/Signup/containers/SignupContainer';

export default (store) => ({
  path: PATH_SIGNUP,
  getComponent(nextState, cb) {
    cb(null, Signup);
  },
  onEnter: onEnter(store),
});

