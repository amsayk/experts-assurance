import user from 'redux/reducers/user/reducer';
import app from 'redux/reducers/app/reducer';
import snackbar from 'redux/reducers/snackbar/reducer';
import notification from 'redux/reducers/notification/reducer';

import {
  combineReducers,
} from 'redux-immutable';

import { INIT } from 'vars';

import { reducer as formReducer } from 'redux-form/immutable';

const reducers = {
  app,
  notification,
  user,
  snackbar,
  form: formReducer,
};

const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...reducers,
    ...asyncReducers,
  });
};

export const injectReducers = (store, reducers) => {
  let changed = false;
  reducers.forEach(({ key, reducer }) => {
    if (Object.hasOwnProperty.call(store.asyncReducers, key)) {return;}
    changed = true;
    store.asyncReducers[key] = reducer;
  });
  if (changed) {
    store.replaceReducer(makeRootReducer(store.asyncReducers));
    // Reinitialize
    store.dispatch({ type: INIT });
  }
};

export default makeRootReducer;

