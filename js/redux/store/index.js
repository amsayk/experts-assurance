import { createStore, applyMiddleware, compose } from 'redux';

import { APP_NAME, BASENAME, DEFAULT_LANG, INIT } from 'vars';

import array from 'redux/middleware/array';
import bufferActions from 'redux/middleware/buffer-actions';

import { fromJS, Set, Map } from 'immutable';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
} from 'redux/reducers/users/constants';

import {
  ACTION as SORT,
} from 'redux/reducers/sorting/constants';

import { AppState } from 'redux/reducers/app/reducer';
import { NotificationState } from 'redux/reducers/notification/reducer';
import { SnackState } from 'redux/reducers/snackbar/reducer';
import { User } from 'redux/reducers/user/reducer';
import { UsersState } from 'redux/reducers/users/reducer';
import { CasesState } from 'redux/reducers/cases/reducer';
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
  bufferActions(),
  array,
  thunk.withExtraArgument({ client: apolloClient, history }),
  reduxCookieMiddleware({
    [VIEW_TYPE_GRID]: {
      reducerKey : 'users.viewType',
      cookieKey  : 'users.viewType',
    },
    [VIEW_TYPE_LIST]: {
      reducerKey : 'users.viewType',
      cookieKey  : 'users.viewType',
    },
    [`${SORT}/users`]: {
      reducerKey : 'users.sortConfig',
      cookieKey  : 'users.sortConfig',
    },
    [`${SORT}/cases`]: {
      reducerKey : 'cases.sortConfig',
      cookieKey  : 'cases.sortConfig',
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

export const store = createStore(makeRootReducer(), fromJS(window.__APP_STATE__ || { app: { lang: DEFAULT_LANG } }, function (key, value) {
  switch (key) {
    case ''             : return new Map(value);
    case 'app'          : return new AppState(value);
    case 'notification' : return new NotificationState(value);
    case 'snackbar'     : return new SnackState(value);
    case 'user'         : return new User(value);
    case 'users'        : return new UsersState(value);
    case 'cases'        : return new CasesState(value);
    case 'selection'    : return new SelectionState(value);
    case 'sortConfig'   : return new SortConfig(value);
    case 'keys'         : return new Set(value);
    case 'form'         : return new Map(value);
    case 'options'      : return value;
    case 'roles'        : return value;
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

