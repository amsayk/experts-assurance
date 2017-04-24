import { compose, createStore, applyMiddleware } from 'redux';

import {
  DEFAULT_LANG,
  APP_NAME,
  INIT,
} from 'vars';

import { fromJS } from 'immutable';

import { IntlState } from 'redux/reducers/intl/reducer';

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

const composeEnhancers = __DEV__ ? composeWithDevTools({ realtime: true, name: APP_NAME }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  ...enhancers
);

export default (opts = {}) => {
  const store = createStore(makeRootReducer(), fromJS({ intl: new IntlState({ locale: opts.lang || DEFAULT_LANG }) }), enhancer);

  store.asyncReducers = {};
  store.injectReducers = (reducers) => injectReducers(store, reducers);

  store.dispatch({ type: INIT });

  return store;
};

