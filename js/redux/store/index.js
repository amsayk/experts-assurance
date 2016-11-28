import { createStore, applyMiddleware, compose } from 'redux';

import array from '../middleware/array';

import Immutable from 'immutable';

import { client as apolloClient } from 'apollo-client';

import { middleware as reduxCookieMiddleware } from 'redux-cookie-persist-middleware';

import { createHistory, useBeforeUnload } from 'history';

import { useRouterHistory } from 'react-router';

import thunk from 'redux-thunk';

import ReduxWorker from 'worker?inline!../worker.js';

import makeRootReducer, { injectReducers } from '../reducers';

import { updateLocation } from 'redux/reducers/routing/actions';

import { applyWorker } from 'redux-worker';

import { getBeforeUnloadMessage } from 'utils/onbeforeunload';

export const history = useBeforeUnload(useRouterHistory(createHistory))({ basename: process.env.BASENAME, });

history.listenBeforeUnload(function () {
  return getBeforeUnloadMessage();
});

// ======================================================
// Webworker
// ======================================================
const worker = new ReduxWorker();

// ======================================================
// Middleware Configuration
// ======================================================
const middlewares = [
  thunk.withExtraArgument(apolloClient),
  array,
  reduxCookieMiddleware({
  })
];

// ======================================================
// Store Enhancers
// ======================================================
const enhancers = [
  applyWorker(worker)
];
if (__DEV__) {
  const devToolsExtension = window.devToolsExtension;
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const enhancer = compose(
  applyMiddleware(...middlewares),
  ...enhancers
);

export const store = createStore(makeRootReducer(), Immutable.fromJS(window.__APP_STATE__ || {}), enhancer);

store.asyncReducers = {};
store.injectReducers = (reducers) => injectReducers(store, reducers);

// To unsubscribe, invoke `store.unsubscribeHistory()` anytime
store.unsubscribeHistory = history.listen(updateLocation(store));

if (module.hot) {
  module.hot.accept('../reducers', () => {
    const reducers = require('../reducers').default;
    store.replaceReducer(reducers(store.asyncReducers));
  });
}

