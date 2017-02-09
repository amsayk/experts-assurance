import { createStore, applyMiddleware, compose } from 'redux';

import { APP_NAME, BASENAME, INIT } from 'vars';

import array from 'redux/middleware/array';

import { fromJS, Set, Map } from 'immutable';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
} from 'redux/reducers/catalog/constants';

import {
  ACTION as SORT,
} from 'redux/reducers/sorting/constants';

import { AppState } from 'redux/reducers/app/reducer';
import { CatalogState } from 'redux/reducers/catalog/reducer';
import { NotificationState } from 'redux/reducers/notification/reducer';
import { SnackState } from 'redux/reducers/snackbar/reducer';
import { User } from 'redux/reducers/user/reducer';
import { SelectionState } from 'redux/reducers/selection/reducer';
import { SortConfig } from 'redux/reducers/sorting/reducer';

import { client as apolloClient } from 'apollo';

import { middleware as reduxCookieMiddleware } from 'redux-cookie-persist-middleware';

import { createHistory, useBeforeUnload, useQueries } from 'history';

import { useRouterHistory } from 'react-router';

import thunk from 'redux-thunk';

import ReduxWorker from 'worker-loader?inline!../worker.js';

import makeRootReducer, { injectReducers } from 'redux/reducers';

import { updateLocation } from 'redux/reducers/routing/actions';

import { applyWorker } from 'redux-worker';

export const history = useQueries(
  useBeforeUnload(
    useRouterHistory(
      createHistory
    )
  )
)({ basename: BASENAME });

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
    [VIEW_TYPE_GRID]: {
      reducerKey : 'catalog.viewType',
      cookieKey  : 'viewType',
    },
    [VIEW_TYPE_LIST]: {
      reducerKey : 'catalog.viewType',
      cookieKey  : 'viewType',
    },
    [`${SORT}/catalog`]: {
      reducerKey : 'catalog.sortConfig',
      cookieKey  : 'catalog.sortConfig',
    },
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

export const store = createStore(makeRootReducer(), fromJS(window.__APP_STATE__ || {}, function (key, value) {
  switch (key) {
    case ''             : return new Map(value);
    case 'app'          : return new AppState(value);
    case 'catalog'      : return new CatalogState(value);
    case 'notification' : return new NotificationState(value);
    case 'snackbar'     : return new SnackState(value);
    case 'user'         : return new User(value);
    case 'selection'    : return new SelectionState(value);
    case 'sortConfig'   : return new SortConfig(value);
    case 'keys'         : return new Set(value);
    case 'form'         : return new Map(value);
    case 'options'      : return value;
  }

  return new Map(value);
}), enhancer);

store.asyncReducers = {};
store.injectReducers = (reducers) => injectReducers(store, reducers);

// To unsubscribe, invoke `store.unsubscribeHistory()` anytime
store.unsubscribeHistory = history.listenBefore(updateLocation(store));

// Initialize
store.dispatch({ type: INIT });

if (module.hot) {
  module.hot.accept('../reducers', () => {
    const makeRootReducer = require('../reducers').default;
    store.replaceReducer(makeRootReducer(store.asyncReducers));
  });
}

