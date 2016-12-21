import { PATH_PASSWORD_RESET } from 'vars';

let PasswordReset;

export default (store) => ({
  path: PATH_PASSWORD_RESET,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      if (PasswordReset) {
        /*  Return getComponent   */
        cb(null, PasswordReset);
        return;
      }

      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const { default : Component } = require('./containers/PasswordResetContainer');

      PasswordReset = Component;

      /*  Return getComponent   */
      cb(null, PasswordReset);

      /* Webpack named bundle   */
    }, 'PasswordReset');
  },
});

