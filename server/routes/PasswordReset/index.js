import { PATH_PASSWORD_RESET } from 'vars';

import { onEnter } from 'authWrappers/NotAuthenticated';

import PasswordReset from 'routes/PasswordReset/containers/PasswordResetContainer';

export default (store) => ({
  path: PATH_PASSWORD_RESET,
  getComponent(nextState, cb) {
    cb(null, PasswordReset);
  },
  onEnter: onEnter(store),
});

