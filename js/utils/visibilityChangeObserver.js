import { logout } from 'redux/reducers/user/actions';
import EventListener from 'EventListener';
import {
  INACTIVITY_TIMEOUT,
} from 'environment';
const debug = require('debug')('app:client:visibilityChangeObserver');

export default function doSetupVisibilityChangeObserver(store) {
  let timeout = null;

  function logOut() {
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }

    store.dispatch(logout());
  }

  function cb() {
    debug(`[VISIBILITY CHANGED]: ${document.visibilityState}`);

    // fires when user switches tabs, apps, goes to homescreen, etc.
    if (document.visibilityState === 'hidden') {
      timeout = window.setTimeout(logOut, INACTIVITY_TIMEOUT);
    }

    // fires when app transitions from prerender, user returns to the app / tab.
    if (document.visibilityState === 'visible') {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
    }
  }

  cb();

  // subscribe to visibility change events
  EventListener.listen(window, 'visibilitychange', cb);
}

