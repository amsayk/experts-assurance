import { PATH_SIGNUP } from 'vars';

let Signup;

export default (store) => ({
  path: PATH_SIGNUP,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      if (Signup) {
        /*  Return getComponent   */
        cb(null, Signup);
        return;
      }

      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const { default : Component } = require('./containers/SignupContainer');
      const { default : NotAuthenticated } = require('authWrappers/NotAuthenticated');

      Signup = NotAuthenticated(Component);

      /*  Return getComponent   */
      cb(null, Signup);

      /* Webpack named bundle   */
    }, 'Signup');
  },
});

