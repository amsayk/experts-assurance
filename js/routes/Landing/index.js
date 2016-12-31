export default (store) => (partialNextState, cb) => {
  require.ensure([], (require) => {
    const { default : Component } = require('./containers/LandingContainer');
    const { default : UserIsAuthenticated } = require('utils/UserIsAuthenticated');

    /* Return Component */
    cb(null, { component: UserIsAuthenticated(Component) });

    /* Webpack named bundle */
  }, 'Landing');
};

