import { PATH_SETTINGS_BUSINESS_DETAILS } from 'vars';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

import BusinessDetailsContainer from 'routes/Settings/containers/Business/BusinessDetailsContainer';

export default (store) => [{
  path: PATH_SETTINGS_BUSINESS_DETAILS,
  getComponent(nextState, cb) {
    cb(null, BusinessDetailsContainer);
  },
  onEnter: onEnter(store),
}];

