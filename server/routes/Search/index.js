import { PATH_SEARCH } from 'vars';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

import Search from 'routes/Search/containers/SearchContainer';

export default (store) => ({
  path: PATH_SEARCH,
  getComponent(nextState, cb) {
    cb(null, Search);
  },
  onEnter: onEnter(store),
});

