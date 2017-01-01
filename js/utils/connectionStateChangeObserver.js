import { connectionStateChange } from 'redux/reducers/app/actions';
import NetInfo from 'NetInfo';
const debug = require('debug')('app:client:connectionStateChangeObserver');

export default function connectionStateChangeObserver(store) {
  function cb(isConnected) {
    debug(`[CONNECTION STATE CHANGED]: ${isConnected}`);
    store.dispatch(connectionStateChange(isConnected));
  }

  // subscribe
  return NetInfo.isConnected.addEventListener('change', cb);
}

