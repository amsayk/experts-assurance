import { PATH_SETTINGS_ACCOUNT, PATH_SETTINGS_CHANGE_PASSWORD } from 'vars';

export default (store) => [{
  path         : PATH_SETTINGS_ACCOUNT,
  getComponent : (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : UserIsAuthenticated } = require('utils/UserIsAuthenticated');
      const { default : Component } = require('./AccountSettingsContainer');

      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle   */
    }, 'AccountSettings');
  },
}, {
  path         : PATH_SETTINGS_CHANGE_PASSWORD,
  getComponent : (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : UserIsAuthenticated } = require('utils/UserIsAuthenticated');
      const { default : Component } = require('./ChangePasswordContainer');

      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle   */
    }, 'ChangePassword');
  },
}];

export const indexRoute = (store) => (partialNextState, cb) => {
  require.ensure([], (require) => {
    const { default : UserIsAuthenticated } = require('utils/UserIsAuthenticated');
    const { default : Component } = require('./AccountSettingsContainer');

    /* Return Component */
    cb(null, { component: UserIsAuthenticated(Component) });

    /* Webpack named bundle */
  }, 'AccountSettingsIndexRoute');
};

