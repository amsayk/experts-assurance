import { PATH_ACTIVATION } from 'vars';

import { UserIsAuthenticated } from 'authWrappers/UserIsAuthenticated';

import Activation from 'routes/Activation/containers/ActivationContainer';

export default (store) => ({
  path: PATH_ACTIVATION,
  getComponent(nextState, cb) {
    cb(null, Activation);
  },
  onEnter: UserIsAuthenticated.onEnter(store),
});

