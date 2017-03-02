import {
  PATH_SETTINGS_BUSINESS_DETAILS,
  PATH_SETTINGS_BUSINESS_USERS,
  PATH_SETTINGS_BUSINESS_USER,
  PATH_SETTINGS_BUSINESS_USER_PARAM,
} from 'vars';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

import BusinessDetailsContainer from 'routes/Settings/containers/Business/BusinessDetailsContainer';
import Users from 'routes/Settings/containers/Business/Users';
import User from 'routes/Settings/containers/Business/User';

import usersReducer from 'redux/reducers/users/reducer';

export default (store) => [{
  path: PATH_SETTINGS_BUSINESS_DETAILS,
  getComponent(nextState, cb) {
    cb(null, BusinessDetailsContainer);
  },
  onEnter: onEnter(store),
}, {
  path: PATH_SETTINGS_BUSINESS_USERS,
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'users', reducer: usersReducer },
    ]);
    cb(null, Users);
  },
  onEnter: onEnter(store),
}, {
  path: PATH_SETTINGS_BUSINESS_USER + '/:' + PATH_SETTINGS_BUSINESS_USER_PARAM,
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'users', reducer: usersReducer },
    ]);
    cb(null, User);
  },
  onEnter: onEnter(store),
}];

