import { PATH_SETTINGS_ACCOUNT, PATH_SETTINGS_CHANGE_PASSWORD, PATH_SETTINGS_CHANGE_EMAIL } from 'vars';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

import AccountSettingsContainer from 'routes/Settings/containers/Account/AccountSettingsContainer';
import ChangeEmailContainer from 'routes/Settings/containers/Account/ChangeEmailContainer';
import ChangePasswordContainer from 'routes/Settings/containers/Account/ChangePasswordContainer';

export default (store) => [{
  path: PATH_SETTINGS_ACCOUNT,
  getComponent(nextState, cb) {
    cb(null, AccountSettingsContainer);
  },
  onEnter: onEnter(store),
}, {
  path: PATH_SETTINGS_CHANGE_EMAIL,
  getComponent(nextState, cb) {
    cb(null, ChangeEmailContainer);
  },
  onEnter: onEnter(store),
}, {
  path: PATH_SETTINGS_CHANGE_PASSWORD,
  getComponent(nextState, cb) {
    cb(null, ChangePasswordContainer);
  },
  onEnter: onEnter(store),
}];

export const getIndexRoute = (store) => (partialNextState, cb) => cb(null, {
  getComponent(nextState, cb) {
    cb(null, AccountSettingsContainer);
  },
  onEnter: onEnter(store),
});

