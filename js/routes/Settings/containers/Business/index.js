import { PATH_SETTINGS_BUSINESS_DETAILS } from 'vars';

export default (store) => [{
  path         : PATH_SETTINGS_BUSINESS_DETAILS,
  getComponent : (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : UserIsAuthenticated } = require('utils/UserIsAuthenticated');
      const { default : Component } = require('./BusinessDetailsContainer');

      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle   */
    }, 'BusinessInfo');
  },
}];

