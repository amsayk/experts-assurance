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

    const { default : importationReducer } = require('redux/reducers/importation/reducer');
    const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');
    const { default : dashboardReducer } = require('redux/reducers/dashboard/reducer');
    const { default : toastrReducer } = require('redux/reducers/toastr/reducer');

    store.injectReducers([
      { key: 'importation', reducer: importationReducer },
      { key: 'docSearch',   reducer: docSearchReducer },
      { key: 'dashboard',   reducer: dashboardReducer },
      { key: 'toastr',      reducer: toastrReducer },
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

      const { default : importationReducer } = require('redux/reducers/importation/reducer');
      const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');
      const { default : dashboardReducer } = require('redux/reducers/dashboard/reducer');
      const { default : toastrReducer } = require('redux/reducers/toastr/reducer');

      store.injectReducers([
        { key: 'importation', reducer: importationReducer },
        { key: 'docSearch',   reducer: docSearchReducer },
        { key: 'dashboard',   reducer: dashboardReducer },
        { key: 'toastr',      reducer: toastrReducer },
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
      const { default : toastrReducer } = require('redux/reducers/toastr/reducer');

      store.injectReducers([
        { key: 'docSearch', reducer: docSearchReducer },
        { key: 'toastr',    reducer: toastrReducer },
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

      const { default : importationReducer } = require('redux/reducers/importation/reducer');
      const { default : casesReducer } = require('redux/reducers/cases/reducer');
      const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');
      const { default : toastrReducer } = require('redux/reducers/toastr/reducer');

      store.injectReducers([
        { key: 'importation', reducer: importationReducer },
        { key: 'cases',       reducer: casesReducer },
        { key: 'docSearch',   reducer: docSearchReducer },
        { key: 'toastr',      reducer: toastrReducer },
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

      const { default : importationReducer } = require('redux/reducers/importation/reducer');
      const { default : casesReducer } = require('redux/reducers/cases/reducer');
      const { default : docSearchReducer } = require('redux/reducers/docSearch/reducer');
      const { default : toastrReducer } = require('redux/reducers/toastr/reducer');

      store.injectReducers([
        { key: 'importation', reducer: importationReducer },
        { key: 'cases',       reducer: casesReducer },
        { key: 'docSearch',   reducer: docSearchReducer },
        { key: 'toastr',      reducer: toastrReducer },
      ]);

      const Case = UserIsAuthenticated(Component);

      /* Return Component */
      cb(null, Case);

      /* Webpack named bundle */
    }, 'Case');

  },
}];

export default { routes : getRoutes, getIndexRoute };
