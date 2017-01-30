import ProductCatalog from 'routes/ProductCatalog/containers/StartPage/ProductCatalogContainer';

import catalogReducer from 'redux/reducers/catalog/reducer';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

export default (store) => [];

export const getIndexRoute = (store) => (partialNextState, cb) => cb(null, {
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'catalog', reducer: catalogReducer },
    ]);

    cb(null, ProductCatalog);
  },
  onEnter: onEnter(store),
});

