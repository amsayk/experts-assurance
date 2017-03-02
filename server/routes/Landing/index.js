import { PATH_CASES, PATH_CASES_CASE, PATH_CASES_CASE_PARAM } from 'vars';

import { onEnter } from 'authWrappers/UserIsAuthenticated';

import Dashboard from 'routes/Landing/containers/Dashboard';
import Cases from 'routes/Landing/containers/Cases';
import Case from 'routes/Landing/containers/Case';

import casesReducer from 'redux/reducers/cases/reducer';

const getIndexRoute = (store) => (partialNextState, cb) => cb(null, {
  getComponent(nextState, cb) {
    cb(null, Dashboard);
  },
  onEnter: onEnter(store),
});

const getRoutes = (store) => [{
  path : '/',
  getComponent(nextState, cb) {
    cb(null, Dashboard);
  },
  onEnter: onEnter(store),
}, {
  path : PATH_CASES,
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'cases', reducer: casesReducer },
    ]);
    cb(null, Cases);
  },
  onEnter: onEnter(store),
}, {
  path : PATH_CASES_CASE + '/:' + PATH_CASES_CASE_PARAM,
  getComponent(nextState, cb) {
    store.injectReducers([
      { key: 'cases', reducer: casesReducer },
    ]);
    cb(null, Case);
  },
  onEnter: onEnter(store),
}];

export default { routes : getRoutes, getIndexRoute };

