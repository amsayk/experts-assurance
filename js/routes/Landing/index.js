let Landing;

export default (store) => ({
  path: '/app',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

      if (Landing) {
        /*  Return getComponent   */
        cb(null, Landing);
        return;
      }

      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const { default : Component } = require('./containers/LandingContainer');

      const { default : UserIsAuthenticated } = require('utils/UserIsAuthenticated');

      Landing = UserIsAuthenticated(Component);

      /*  Return getComponent   */
      cb(null, Landing);

      /* Webpack named bundle   */
    }, 'Landing');
  },
});

