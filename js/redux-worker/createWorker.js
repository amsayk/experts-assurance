export default function createWorker() {
  // Initialize ReduxWorekr
  const worker = new ReduxWorker();

  self.addEventListener('message', function (e) {
    const action = e.data;

    if (typeof action.task === 'string' && typeof action._taskId === 'number') {
      const taskRunner = worker.tasks[ action.task ];

      if (!taskRunner || typeof taskRunner !== 'function') {
        throw new Error('Cannot find runner for task ' + action.task + '. Have you registerTask yet?');
      }

      // Send new state to main thread
      self.postMessage({
        _taskId: action._taskId,
        response: taskRunner(action)
      });
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
    this.tasks[ name ] = taskFn;
  }

}

