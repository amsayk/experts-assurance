import ProductPage from 'routes/ProductCatalog/containers/ProductPage/ProductContainer';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

import {
  PATH_PRODUCT_CATALOG_PRODUCT_BASE,
  PATH_PRODUCT_CATALOG_PRODUCT_PARAM,
} from 'vars';

export default (store) => [{
  path : PATH_PRODUCT_CATALOG_PRODUCT_BASE + '/:' + PATH_PRODUCT_CATALOG_PRODUCT_PARAM,
  getIndexRoute : (partialNextState, cb) => {
    cb(null, {
      getComponent(nextState, cb) {
        cb(null, ProductPage);
      },
      onEnter: onEnter(store),
    });
  },
  childRoutes : [],
}];

