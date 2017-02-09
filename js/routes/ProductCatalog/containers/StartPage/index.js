import {
  PATH_PRODUCT_CATALOG_LABEL_BASE,
  PATH_PRODUCT_CATALOG_LABEL_PARAM,
} from 'vars';

export default (store) => [{
  path : PATH_PRODUCT_CATALOG_LABEL_BASE + '/:' + PATH_PRODUCT_CATALOG_LABEL_PARAM,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const { default : Component } = require('./ProductCatalogContainer');
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

      const { default : catalogReducer } = require('redux/reducers/catalog/reducer');

      store.injectReducers([
        { key: 'catalog', reducer: catalogReducer },
      ]);

      /* Return Component */
      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle */
    }, 'ProductCatalogLabelRoute');
  },
}];

export const getIndexRoute = (store) => (partialNextState, cb) => {
  require.ensure([], (require) => {
    const { default : Component } = require('./ProductCatalogContainer');
    const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

    const { default : catalogReducer } = require('redux/reducers/catalog/reducer');

    store.injectReducers([
      { key: 'catalog', reducer: catalogReducer },
    ]);

    /* Return Component */
    cb(null, { component: UserIsAuthenticated(Component) });

    /* Webpack named bundle */
  }, 'ProductCatalogIndexRoute');
};

