import {
  PATH_DASHBOARD,
  PATH_CASES,
  PATH_CASES_CASE,
  PATH_CASES_CASE_PARAM,
} from 'vars';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

import Home from 'routes/Landing/containers/Home';
import Dashboard from 'routes/Landing/containers/Dashboard';
import Cases from 'routes/Landing/containers/Cases';
import Case from 'routes/Landing/containers/Case';

import casesReducer from 'redux/reducers/cases/reducer';
import docSearchReducer from 'redux/reducers/docSearch/reducer';
import dashboardReducer from 'redux/reducers/dashboard/reducer';
import toastrReducer from 'redux/reducers/toastr/reducer';

const getIndexRoute = (store) => (partialNextState, cb) => cb(null, {
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'docSearch', reducer: docSearchReducer },
      { key: 'dashboard', reducer: dashboardReducer },
      { key: 'toastr',    reducer: toastrReducer },
    ]);
    cb(null, Home);
  },
  onEnter: onEnter(store),
});

const getRoutes = (store) => [{
  path : '/',
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'docSearch', reducer: docSearchReducer },
      { key: 'dashboard', reducer: dashboardReducer },
      { key: 'toastr',    reducer: toastrReducer },
    ]);
    cb(null, Home);
  },
  onEnter: onEnter(store),
}, {
  path : PATH_DASHBOARD,
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'docSearch', reducer: docSearchReducer },
      { key: 'toastr',    reducer: toastrReducer },
    ]);
    cb(null, Dashboard);
  },
  onEnter: onEnter(store),
}, {
  path : PATH_CASES,
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'cases', reducer: casesReducer },
      { key: 'docSearch', reducer: docSearchReducer },
      { key: 'toastr',    reducer: toastrReducer },
    ]);
    cb(null, Cases);
  },
  onEnter: onEnter(store),
}, {
  path : PATH_CASES_CASE + '/:' + PATH_CASES_CASE_PARAM,
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'cases', reducer: casesReducer },
      { key: 'docSearch', reducer: docSearchReducer },
      { key: 'toastr',    reducer: toastrReducer },
    ]);
    cb(null, Case);
  },
  onEnter: onEnter(store),
}];

export default { routes : getRoutes, getIndexRoute };

