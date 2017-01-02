import { logOut } from 'redux/reducers/user/actions';
import AppState from 'AppState';
import {
  INACTIVITY_TIMEOUT,
} from 'vars';
const log = require('log')('app:client:appStateChangeObserver');

export default function appStateChangeObserver(store) {
  let timeout;

  function clearTimeout() {
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }
  }

  function doLogOut() {
    clearTimeout();
    store.dispatch(logOut());
  }

  function cb() {
    log(`[APP STATE CHANGED]: ${AppState.currentState}`);

    clearTimeout();

    // fires when user switches tabs, apps, goes to homescreen, etc.
    if (AppState.currentState === 'background') {
      timeout = window.setTimeout(doLogOut, INACTIVITY_TIMEOUT);
    }
  }

  // subscribe to visibility change events
  AppState.addEventListener('change', cb);
  return {
    remove: () =>  {
      clearTimeout();
      AppState.removeEventListener('change', cb)
    },
  };
}

