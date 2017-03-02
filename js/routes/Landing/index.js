import { PATH_CASES, PATH_CASES_CASE, PATH_CASES_CASE_PARAM } from 'vars';

const getIndexRoute = (store) => (partialNextState, cb) => {
  require.ensure([], (require) => {
    const { default : Component } = require('./containers/Dashboard');
    const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

    /* Return Component */
    cb(null, { component: UserIsAuthenticated(Component) });

    /* Webpack named bundle */
  }, 'Landing');
};

const getRoutes = (store) => [{
  path : '/',
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : Component } = require('./containers/Dashboard');
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

      /* Return Component */
      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle */
    }, 'Dashboard');
  },
}, {
  path : PATH_CASES,
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : Component } = require('./containers/Cases');
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

      const { default : casesReducer } = require('redux/reducers/cases/reducer');

      store.injectReducers([
        { key: 'cases', reducer: casesReducer },
      ]);

      /* Return Component */
      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle */
    }, 'Cases');

  },
}, {
  path : PATH_CASES_CASE + '/:' + PATH_CASES_CASE_PARAM,
  getComponent : (nextState, cb) => {
  require.ensure([], (require) => {
    const { default : Component } = require('./containers/Case');
    const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

    const { default : casesReducer } = require('redux/reducers/cases/reducer');

    store.injectReducers([
      { key: 'cases', reducer: casesReducer },
    ]);

    const Case = UserIsAuthenticated(Component);

    /* Return Component */
    cb(null, Case);

    /* Webpack named bundle */
  }, 'Case');

},
}];

export default { routes : getRoutes, getIndexRoute };

