import { onEnter } from 'authWrappers/UserIsAuthenticated';

import LandingContainer from 'routes/Landing/containers/LandingContainer';

export default (store) => (partialNextState, cb) => cb(null, {
  getComponent(nextState, cb) {
    cb(null, LandingContainer);
  },
  onEnter: onEnter(store),
});

