import { PATH_ACTIVATION } from 'vars';

let Activation;

export default store => ({
  path: PATH_ACTIVATION,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        if (Activation) {
          /*  Return getComponent   */
          cb(null, Activation);
          return;
        }

        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const {
          default: Component,
        } = require('./containers/ActivationContainer');
        const {
          UserIsAuthenticated,
          EmailIsVerified,
        } = require('authWrappers/UserIsAuthenticated');

        Activation = UserIsAuthenticated(EmailIsVerified(Component));

        /*  Return getComponent   */
        cb(null, Activation);

        /* Webpack named bundle   */
      },
      'Activation',
    );
  },
});
