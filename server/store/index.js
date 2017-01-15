import { createStore, applyMiddleware } from 'redux';

import {
  APP_NAME,
  INIT,
} from 'vars';

import { middleware as reduxCookieMiddleware } from 'redux-cookie-persist-middleware';

import { composeWithDevTools } from 'remote-redux-devtools';

import makeRootReducer, { injectReducers } from './reducers';

import thunk from 'redux-thunk';

import array from 'redux/middleware/array';

const middlewares = [
  thunk,
  array,
  reduxCookieMiddleware({
  }),
];

// ======================================================
// Store Enhancers
// ======================================================
const enhancers = [
];

const composeEnhancers = composeWithDevTools({ realtime: true, name: APP_NAME });

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  ...enhancers
);

export default () => {
  const store = createStore(makeRootReducer(), enhancer);

  store.asyncReducers = {};
  store.injectReducers = (reducers) => injectReducers(store, reducers);

  store.dispatch({ type: INIT });

  return store;
};

