import user from 'redux/reducers/user/reducer';
import app from 'redux/reducers/app/reducer';
import snackbar from 'redux/reducers/snackbar/reducer';
import notification from 'redux/reducers/notification/reducer';
import scrolling from 'redux/reducers/scrolling/reducer';

import { combineReducers } from 'redux-immutable';

import { INIT } from 'vars';

import { reducer as formReducer } from 'redux-form/immutable';

const reducers = {
  app,
  notification,
  scrolling,
  user,
  snackbar,
  form: formReducer,
};

const makeRootReducer = asyncReducers => {
  return combineReducers({
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
