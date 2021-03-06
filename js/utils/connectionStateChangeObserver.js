import { connectionStateChange } from 'redux/reducers/app/actions';
import NetInfo from 'NetInfo';
import debug from 'log';

const log = debug('app:client:connectionStateChangeObserver');

export default function connectionStateChangeObserver(store) {
  function cb(isConnected) {
    log(`[CONNECTION STATE CHANGED]: ${isConnected}`);
    store.dispatch(connectionStateChange(isConnected));
  }

  // subscribe
  return NetInfo.isConnected.addEventListener('change', cb);
}

