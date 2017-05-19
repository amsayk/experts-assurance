import { createStore, applyMiddleware, compose } from 'redux';

import { APP_NAME, BASENAME, DEFAULT_LANG, DEBUG, INIT } from 'vars';

import pick from 'lodash.pick';

import array from 'redux/middleware/array';
import bufferActions from 'redux/middleware/buffer-actions';

import { fromJS, Set, Map } from 'immutable';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
} from 'redux/reducers/users/constants';

import {
  SET_DURATION as DASHBOARD_SET_DURATION,
  TOGGLE as DASHBOARD_TOGGLE,
  // TOGGLE_INCLUDE_CANCELED as DASHBOARD_TOGGLE_INCLUDE_CANCELED,
  // SET_ONLY_VALID_OPEN as DASHBOARD_SET_ONLY_VALID_OPEN,
} from 'redux/reducers/dashboard/constants';

import {
  ACTION as SORT,
} from 'redux/reducers/sorting/constants';

import { IntlState } from 'redux/reducers/intl/reducer';
import { AppState } from 'redux/reducers/app/reducer';
import { DocSearchState } from 'redux/reducers/docSearch/reducer';
import { DashboardState } from 'redux/reducers/dashboard/reducer';
import { NotificationState } from 'redux/reducers/notification/reducer';
import { ScrollState } from 'redux/reducers/scrolling/reducer';
import { SnackState } from 'redux/reducers/snackbar/reducer';
import { ToastrState } from 'redux/reducers/toastr/reducer';
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
    // Users
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

    // Cases
    [`${SORT}/cases`]: {
      reducerKey : 'cases.sortConfig',
      cookieKey  : 'cases.sortConfig',
    },

    // Dashboard
    [DASHBOARD_TOGGLE]: {
      reducerKey : (state) => state.get('dashboard').viewStatus,
      cookieKey  : 'dashboard.viewStatus',
    },

    // [DASHBOARD_TOGGLE_INCLUDE_CANCELED]: {
    //   reducerKey : 'dashboard.includeCanceled',
    //   cookieKey  : 'dashboard.includeCanceled',
    // },

    [DASHBOARD_SET_DURATION]: {
      reducerKey : (state) => state.get('dashboard').durations,
      cookieKey  : 'dashboard.durations',
    },

    // [DASHBOARD_SET_ONLY_VALID_OPEN]: {
    //   reducerKey : 'dashboard.onlyValidOpen',
    //   cookieKey  : 'dashboard.onlyValidOpen',
    // },

    // [`${SORT}/pendingDashboard`]: {
    //   reducerKey : (state) => pick(state.get('dashboard').pendingSortConfig, ['key', 'direction']),
    //   cookieKey  : 'dashboard.pendingSortConfig',
    // },
    [`${SORT}/openDashboard`]: {
      reducerKey : (state) => pick(state.get('dashboard').openSortConfig, ['key', 'direction']),
      cookieKey  : 'dashboard.openSortConfig',
    },
    [`${SORT}/unpaidDashboard`]: {
      reducerKey : (state) => pick(state.get('dashboard').unpaidSortConfig, ['key', 'direction']),
      cookieKey  : 'dashboard.unpaidSortConfig',
    },
    [`${SORT}/invalidDashboard`]: {
      reducerKey : (state) => pick(state.get('dashboard').invalidSortConfig, ['key', 'direction']),
      cookieKey  : 'dashboard.invalidSortConfig',
    },
    // [`${SORT}/closedDashboard`]: {
    //   reducerKey : (state) => pick(state.get('dashboard').closedSortConfig, ['key', 'direction']),
    //   cookieKey  : 'dashboard.closedSortConfig',
    // },
  }),
];

// ======================================================
// Store Enhancers
// ======================================================
const enhancers = [
  applyWorker(worker),
];

const composeEnhancers =
  (__DEV__ || DEBUG) &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    name: APP_NAME,
  }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  ...enhancers
);

export const store = createStore(makeRootReducer(), fromJS(window.__APP_STATE__ || { intl: { locale: DEFAULT_LANG } }, function (key, value) {
  switch (key) {
    case ''                 : return new Map(value);
    case 'intl'             : return new IntlState(value);
    case 'app'              : return new AppState(value);
    case 'docSearch'        : return new DocSearchState(value);
    case 'dashboard'        : return new DashboardState(value);
    case 'notification'     : return new NotificationState(value);
    case 'scrolling'        : return new ScrollState(value);
    case 'snackbar'         : return new SnackState(value);
    case 'toastr'           : return new ToastrState(value);
    case 'user'             : return new User(value);
    case 'users'            : return new UsersState(value);
    case 'cases'            : return new CasesState(value);
    case 'selection'        : return new SelectionState(value);
    case 'sortConfig'       : return new SortConfig(value);
    case 'keys'             : return new Set(value);
    case 'form'             : return new Map(value);

    case 'options'          : return value;
    case 'roles'            : return value;
    case 'business'         : return value;
    case 'authorization'    : return value;
    case 'confirm'          : return value;

    case 'messages'         : return value;
    case 'formats'          : return value;
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

