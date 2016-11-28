import { connectionStateChange, } from 'redux/reducers/app/actions';
import EventListener from 'EventListener';
const debug = require('debug')('app:client:connectionStateChangeObserver');

export default function connectionStateChangeObserver(store) {
  function cb() {
    debug(`[CONNECTION STATE CHANGED]: ${window.navigator.onLine}`);
    store.dispatch(connectionStateChange());
  }

  // subscribe
  EventListener.listen(window, 'online', cb);
  EventListener.listen(window, 'offline', cb);
}

