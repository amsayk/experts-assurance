import { PATH_CHOOSE_PASSWORD } from 'vars';

import { onEnter } from 'authWrappers/NotAuthenticated';

import ChoosePassword from 'routes/ChoosePassword/containers/ChoosePasswordContainer';

export default (store) => ({
  path: PATH_CHOOSE_PASSWORD,
  getComponent(nextState, cb) {
    cb(null, ChoosePassword);
  },
  onEnter: onEnter(store),
});

