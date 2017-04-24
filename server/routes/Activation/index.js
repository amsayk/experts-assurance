import { PATH_ACTIVATION } from 'vars';

import { connect, UserIsAuthenticated, EmailIsVerified } from 'authWrappers/UserIsAuthenticated';

import Activation from 'routes/Activation/containers/ActivationContainer';

export default (store) => ({
  path: PATH_ACTIVATION,
  getComponent(nextState, cb) {
    cb(null, Activation);
  },
  onEnter: connect(store)(
    UserIsAuthenticated.onEnter,
    EmailIsVerified.onEnter,
  ),
});

