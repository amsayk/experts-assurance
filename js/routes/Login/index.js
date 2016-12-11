import { PATH_LOGIN } from 'env';

let Login;

export default (store) => ({
  path: PATH_LOGIN,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      if (Login) {
        /*  Return getComponent   */
        cb(null, Login);
        return;
      }

      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const { default : Component } = require('./containers/LoginContainer');

      Login = Component;

      /*  Return getComponent   */
      cb(null, Login);

      /* Webpack named bundle   */
    }, 'Login');
  },
});

