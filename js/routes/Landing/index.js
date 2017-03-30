import {
  PATH_DASHBOARD,
  PATH_CASES,
  PATH_CASES_CASE,
  PATH_CASES_CASE_PARAM,
} from 'vars';

const getIndexRoute = (store) => (partialNextState, cb) => {
  require.ensure([], (require) => {
    const { default : Component } = require('./containers/Home');
    const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

    const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');
    const { default : dashboardReducer } = require('redux/reducers/dashboard/reducer');

    store.injectReducers([
      { key: 'docSearch', reducer: docSearchReducer },
      { key: 'dashboard', reducer: dashboardReducer },
    ]);

    /* Return Component */
    cb(null, { component: UserIsAuthenticated(Component) });

    /* Webpack named bundle */
  }, 'Landing');
};

const getRoutes = (store) => [{
  path : '/',
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : Component } = require('./containers/Home');
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

      const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');
      const { default : dashboardReducer } = require('redux/reducers/dashboard/reducer');

      store.injectReducers([
        { key: 'docSearch', reducer: docSearchReducer },
        { key: 'dashboard', reducer: dashboardReducer },
      ]);

      /* Return Component */
      cb(null, UserIsAuthenticated(Component));

      /* Webpack named bundle */
    }, 'Home');
  },
}, {
  path : PATH_DASHBOARD,
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      const { default : Component } = require('./containers/Dashboard');
      const { default : UserIsAuthenticated } = require('authWrappers/UserIsAuthenticated');

      const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');

      store.injectReducers([
        { key: 'docSearch', reducer: docSearchReducer },
      ]);

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
      const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');

      store.injectReducers([
        { key: 'cases', reducer: casesReducer },
        { key: 'docSearch', reducer: docSearchReducer },
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
      const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');

      store.injectReducers([
        { key: 'cases', reducer: casesReducer },
        { key: 'docSearch', reducer: docSearchReducer },
      ]);

      const Case = UserIsAuthenticated(Component);

      /* Return Component */
      cb(null, Case);

      /* Webpack named bundle */
    }, 'Case');

  },
}];

export default { routes : getRoutes, getIndexRoute };

