import user from './user/reducer';
import app from './app/reducer';
import snackbar from './snackbar/reducer';
import notification from './notification/reducer';
import scrolling from './scrolling/reducer';
import intl from './intl/reducer';

import { USER_LOGGED_OUT } from './user/constants';

import { combineReducers } from 'redux-immutable';

import { INIT } from 'vars';

import routerReducer from './routing/reducer';

import { reducer as formReducer, actionTypes } from 'redux-form/immutable';

const reducers = {
  intl,
  app,
  notification,
  scrolling,
  user,
  snackbar,
  form: formReducer.plugin({
    login: (state, action) => {
      switch (action.type) {
        case USER_LOGGED_OUT:
          return state
            ? state.mergeDeep({
                values: {
                  password: undefined,
                },
              })
            : state;
        case actionTypes.SUBMIT_START: // Clear errors
          return state
            ? state.merge({
                error: null,
              })
            : state;
        default:
          return state;
      }
    },
    changePassword: (state, action) => {
      switch (action.type) {
        case actionTypes.SET_SUBMIT_SUCCEEDED: // Clear passwords on success
          return state
            ? state.merge({
                values: {},
              })
            : state;
        default:
          return state;
      }
    },
    changeEmail: (state, action) => {
      switch (action.type) {
        case actionTypes.SET_SUBMIT_SUCCEEDED: // Clear email on success
          return state
            ? state.merge({
                values: {},
              })
            : state;
        default:
          return state;
      }
    },
  }),
};

const makeRootReducer = asyncReducers => {
  return combineReducers({
    routing: routerReducer,
    ...reducers,
    ...asyncReducers,
  });
};

export const injectReducers = (store, reducers) => {
  let changed = false;
  reducers.forEach(({ key, reducer }) => {
    if (!Object.hasOwnProperty.call(store.asyncReducers, key)) {
      changed = true;
      store.asyncReducers[key] = reducer;
    }
  });
  if (changed) {
    store.replaceReducer(makeRootReducer(store.asyncReducers));
    store.dispatch({ type: INIT });
  }
};

export default makeRootReducer;
