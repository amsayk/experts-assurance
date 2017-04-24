import {
  PATH_SETTINGS_BUSINESS_DETAILS,
  PATH_SETTINGS_BUSINESS_USERS,
  PATH_SETTINGS_BUSINESS_USER,
  PATH_SETTINGS_BUSINESS_USER_PARAM,
} from 'vars';

export default (store) => [{
  path         : PATH_SETTINGS_BUSINESS_DETAILS,
  getComponent : (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');
      const { default : Component } = require('./BusinessDetailsContainer');

      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle   */
    }, 'BusinessDetails');
  },
}, {
  path         : PATH_SETTINGS_BUSINESS_USERS,
  getComponent : (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');
      const { default : Component } = require('./Users');

      const { default : usersReducer } = require('redux/reducers/users/reducer');

      store.injectReducers([
        { key: 'users', reducer: usersReducer },
      ]);

      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle   */
    }, 'Users');
  },
}, {
  path         : PATH_SETTINGS_BUSINESS_USER + '/:' + PATH_SETTINGS_BUSINESS_USER_PARAM,
  getComponent : (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');
      const { default : Component } = require('./User');

      const { default : usersReducer } = require('redux/reducers/users/reducer');
      const { default : toastrReducer } = require('redux/reducers/toastr/reducer');

      store.injectReducers([
        { key: 'users', reducer: usersReducer },
        { key: 'toastr', reducer: toastrReducer },
      ]);

      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle   */
    }, 'User');
  },
}];

