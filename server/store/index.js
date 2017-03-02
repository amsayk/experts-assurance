import { createStore, applyMiddleware } from 'redux';

import {
  DEFAULT_LANG,
  APP_NAME,
  INIT,
} from 'vars';

import { fromJS } from 'immutable';

import { AppState } from 'redux/reducers/app/reducer';

import { composeWithDevTools } from 'remote-redux-devtools';

import makeRootReducer, { injectReducers } from './reducers';

import thunk from 'redux-thunk';

import array from 'redux/middleware/array';

const middlewares = [
  thunk,
  array,
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

export default (opts = {}) => {
  const store = createStore(makeRootReducer(), fromJS({ app: new AppState({ lang: opts.lang || DEFAULT_LANG }) }), enhancer);

  store.asyncReducers = {};
  store.injectReducers = (reducers) => injectReducers(store, reducers);

  store.dispatch({ type: INIT });

  return store;
};

