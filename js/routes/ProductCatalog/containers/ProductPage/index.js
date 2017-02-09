import {
  PATH_PRODUCT_CATALOG_PRODUCT_BASE,
  PATH_PRODUCT_CATALOG_PRODUCT_PARAM,
} from 'vars';

export default (store) => [{
  path : PATH_PRODUCT_CATALOG_PRODUCT_BASE + '/:' + PATH_PRODUCT_CATALOG_PRODUCT_PARAM,
  getIndexRoute : (partialNextState, cb) => {
    require.ensure([], (require) => {
      const { default : Component } = require('./ProductContainer');
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

      const { default : catalogReducer } = require('redux/reducers/catalog/reducer');

      store.injectReducers([
        { key: 'catalog', reducer: catalogReducer },
      ]);

      /* Return Component */
      cb(null, { component: UserIsAuthenticated(Component) });

      /* Webpack named bundle */
    }, 'ProductIndexRoute');
  },
  childRoutes : [],
}];

