import { logOut } from 'redux/reducers/user/actions';
import AppState from 'AppState';
import {
  INACTIVITY_TIMEOUT,
} from 'vars';
const log = require('log')('app:client:appStateChangeObserver');

export default function appStateChangeObserver(store) {
  let timeout;

  function doLogOut() {
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }

    store.dispatch(logOut());
  }

  function cb() {
    log(`[APP STATE CHANGED]: ${AppState.currentState}`);

    // fires when user switches tabs, apps, goes to homescreen, etc.
    if (AppState.currentState === 'background') {
      timeout = window.setTimeout(doLogOut, INACTIVITY_TIMEOUT);
    }

    // fires when app transitions from prerender, user returns to the app / tab.
    if (AppState.currentState === 'active') {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
    }
  }

  cb();

  // subscribe to visibility change events
  AppState.addEventListener('change', cb);
  return {
    remove: () => AppState.removeEventListener('change', cb),
  };
}

