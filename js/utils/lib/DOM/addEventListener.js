import EventListener from 'EventListener';
import ReactDOM from 'react-dom';

export default function addEventListenerWrap(target, eventType, cb) {
  /* eslint camelcase: 2 */
  const callback = ReactDOM.unstable_batchedUpdates ? function run(e) {
    ReactDOM.unstable_batchedUpdates(cb, e);
  } : cb;
  return EventListener.listen(target, eventType, callback);
}

