import { createStore, applyMiddleware, compose } from 'redux';

import { APP_NAME } from 'env';

import array from '../middleware/array';

import Immutable from 'immutable';

import { client as apolloClient } from 'apollo';

import { middleware as reduxCookieMiddleware } from 'redux-cookie-persist-middleware';

import { createHistory, useBeforeUnload, useQueries } from 'history';

import { useRouterHistory } from 'react-router';

import thunk from 'redux-thunk';

import ReduxWorker from 'worker?inline!../worker.js';

import makeRootReducer, { injectReducers } from '../reducers';

import { updateLocation } from 'redux/reducers/routing/actions';

import { applyWorker } from 'redux-worker';

import { getBeforeUnloadMessage } from 'utils/onbeforeunload';

import { BASENAME } from 'env';

export const history = useQueries(
  useBeforeUnload(
    useRouterHistory(
      createHistory
    )
  )
)({ basename: BASENAME });

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
  thunk.withExtraArgument({ client: apolloClient, history }),
  array,
  reduxCookieMiddleware({
  }),
];

// ======================================================
// Store Enhancers
// ======================================================
const enhancers = [
  applyWorker(worker),
];

const composeEnhancers =
  __DEV__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    name: APP_NAME,
  }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  ...enhancers
);

export const store = createStore(makeRootReducer(), Immutable.fromJS({}), enhancer);

store.asyncReducers = {};
store.injectReducers = (reducers) => injectReducers(store, reducers);

// To unsubscribe, invoke `store.unsubscribeHistory()` anytime
store.unsubscribeHistory = history.listenBefore(updateLocation(store));

if (module.hot) {
  module.hot.accept('../reducers', () => {
    const reducers = require('../reducers').default;
    store.replaceReducer(reducers(store.asyncReducers));
  });
}

