import { PATH_AUTHORIZATION } from 'vars';

import { connect, UserIsAuthenticated, UserIsAuthorized } from 'authWrappers/UserIsAuthenticated';

import Authorization from 'routes/Authorization/containers/AuthorizationContainer';

export default (store) => ({
  path: PATH_AUTHORIZATION,
  getComponent(nextState, cb) {
    cb(null, Authorization);
  },
  onEnter: connect(store)(
    UserIsAuthenticated.onEnter,
    UserIsAuthorized.onEnter,
  ),
});

