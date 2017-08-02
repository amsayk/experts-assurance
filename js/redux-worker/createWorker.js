import isPromise from 'is-promise';

import invariant from 'invariant';

export default function createWorker() {
  // Initialize ReduxWorker
  const worker = new ReduxWorker();

  self.addEventListener('message', function(e) {
    const action = e.data;

    if (typeof action.task === 'string' && typeof action._taskId === 'number') {
      const taskRunner = worker.tasks[action.task];

      if (!taskRunner || typeof taskRunner !== 'function') {
        throw new Error(
          'Cannot find runner for task ' +
            action.task +
            '. Have you registerTask yet?',
        );
      }

      const response = taskRunner(action);

      if (isPromise(response)) {
        response.then(response => {
          sefl.postMessage({
            _taskId: action._taskId,
            response,
          });
        });
      } else {
        // Send new state to main thread
        self.postMessage({
          _taskId: action._taskId,
          response,
        });
      }
    }
  });

  return worker;
}

class ReduxWorker {
  constructor() {
    // Taskrunners
    this.tasks = {};
  }

  registerTask(name, taskFn) {
    invariant(name, 'ReduxWorker: Task name required.');
    this.tasks[name] = taskFn;
  }
}
