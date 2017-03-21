import { PATH_SEARCH } from 'vars';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

import Search from 'routes/Search/containers/SearchContainer';

import docSearchReducer from 'redux/reducers/docSearch/reducer';

export default (store) => ({
  path: PATH_SEARCH,
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'docSearch', reducer: docSearchReducer },
    ]);
    cb(null, Search);
  },
  onEnter: onEnter(store),
});

