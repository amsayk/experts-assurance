export default (store) => [];

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

