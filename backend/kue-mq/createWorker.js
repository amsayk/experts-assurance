import kue from 'kue';

import { deserializeParseObject } from 'backend/utils';

const log = require('log')('app:backend:mq');

/**
 * Create new kue-mq server
 * @param {object} opts - options for redis connection and creation of queue
 * @param {object} name - name of the server
 * @param {object} methods - supported methods for this server
 *
 * @returns {object} with property queue and method send
 */
export default function createWorker(opts, name, methods) {
  log('Creating worker for', name, Object.keys(methods));
  const queue = kue.createQueue(opts);

  queue.process(name, opts.concurrency || 1, function (job, done) {
    log(`${name}.${job.data.__serverMethod}(...)`);
    const serverMethod = job.data.__serverMethod;
    if (!methods.hasOwnProperty(serverMethod)) {
      done('This method does not support by this server');
    }
    try {
      const request = job.data.req;

      request.user = deserializeParseObject(request.user);
      request.log = (...args) => log(serverMethod, ...args);

      methods[serverMethod](request, done);
    } catch (e) {
      log.error(`Error while executing ${serverMethod}:`, e);
      done(new Error(e));
    }
  });

  queue.on('job complete', function (id) {
    kue.Job.get(id, function (err, job){
      if (err) { return; }
      job.remove(function (err){
        if (err) { throw err; }
        log('removed completed job %s:%s:#%d', name, job.data.__serverMethod, job.id);
      });
    });
  });

  queue.on('job failed', function (id) {
    kue.Job.get(id, function (err, job){
      if (err) { return; }
      job.remove(function (err){
        if (err) { throw err; }
        log('removed failed job %s:%s:#%d', name, job.data.__serverMethod, job.id);
      });
    });
  });

  return queue;
}

