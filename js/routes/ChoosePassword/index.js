import { PATH_CHOOSE_PASSWORD } from 'vars';

let ChoosePassword;

export default (store) => ({
  path: PATH_CHOOSE_PASSWORD,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

      if (ChoosePassword) {
        /*  Return getComponent   */
        cb(null, ChoosePassword);
        return;
      }

      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const { default : Component } = require('./containers/ChoosePasswordContainer');
      const { default : NotAuthenticated } = require('authWrappers/NotAuthenticated');

      ChoosePassword = NotAuthenticated(Component);

      /*  Return getComponent   */
      cb(null, ChoosePassword);

      /* Webpack named bundle   */
    }, 'ChoosePassword');
  },
});

