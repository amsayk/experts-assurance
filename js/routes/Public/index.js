let Public;

export default (store) => ({
  path: '/',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

      if (Public) {
        /*  Return getComponent   */
        cb(null, Public);
        return;
      }

      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const { default : Component } = require('./containers/PublicContainer');

      Public = Component;

      /*  Return getComponent   */
      cb(null, Public);

      /* Webpack named bundle   */
    }, 'Public');
  },
});

