import { PATH_AUTHORIZATION } from 'vars';

let Authorization;

export default (store) => ({
  path: PATH_AUTHORIZATION,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      if (Authorization) {
        /*  Return getComponent   */
        cb(null, Authorization);
        return;
      }

      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const { default : Component } = require('./containers/AuthorizationContainer');
      const { UserIsAuthenticated, EmailIsNotVerified, UserIsAuthorized } = require('authWrappers/UserIsAuthenticated');

      Authorization = UserIsAuthenticated(
        EmailIsNotVerified(
          UserIsAuthorized(
            Component
          )
        )
      );

      /*  Return getComponent   */
      cb(null, Authorization);

      /* Webpack named bundle   */
    }, 'Authorization');
  },
});

