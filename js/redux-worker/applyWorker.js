import objectAssign from 'object-assign';

const defer = function () {
  let result = {};
  result.promise = new Promise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

const applyWorker = (worker) => {
  return createStore => (reducer, initialState, enhancer) => {
    if (!(worker instanceof Worker)) {
      throw new TypeError('Expect input to be a Web Worker. Fall back to normal store.');
    }

    // Start task id;
    let taskId = 0;
    let taskCompleteCallbacks = {};

    // Create store using new reducer
    let store = createStore(reducer, initialState, enhancer);

    // Store reference of old dispatcher
    let next = store.dispatch;

    // Replace dispatcher
    store.dispatch = (action) => {
      if (typeof action.task === 'string') {
        let task = objectAssign({}, action, { _taskId: taskId });
        let deferred = defer();

        taskCompleteCallbacks[taskId] = deferred;
        taskId++;
        worker.postMessage(task);
        return deferred.promise;
      }

      return next(action);
    };

    store.isWorker = true;

    // Add worker events listener
    worker.addEventListener('message', function (e) {
      let action = e.data;

      if (typeof action._taskId === 'number') {
        let wrapped = taskCompleteCallbacks[action._taskId];

        if (wrapped) {
          wrapped.resolve(action);
          delete taskCompleteCallbacks[action._taskId];
        }
      }
    });

    return store;
  };
};

export default applyWorker;

