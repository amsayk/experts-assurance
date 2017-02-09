import ProductCatalog from 'routes/ProductCatalog/containers/StartPage/ProductCatalogContainer';

import catalogReducer from 'redux/reducers/catalog/reducer';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

import {
  PATH_PRODUCT_CATALOG_LABEL_BASE,
  PATH_PRODUCT_CATALOG_LABEL_PARAM,
} from 'vars';

export default (store) => [{
  path : PATH_PRODUCT_CATALOG_LABEL_BASE + '/:' + PATH_PRODUCT_CATALOG_LABEL_PARAM,
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'catalog', reducer: catalogReducer },
    ]);

    cb(null, ProductCatalog);
  },
  onEnter: onEnter(store),
}];

export const getIndexRoute = (store) => (partialNextState, cb) => cb(null, {
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'catalog', reducer: catalogReducer },
    ]);

    cb(null, ProductCatalog);
  },
  onEnter: onEnter(store),
});

