import kue from 'kue';

import { deserializeParseObject } from 'backend/utils';

const log = require('log')('app:backend:mq:backend');

/**
 * Create new kue-mq server
 * @param {object} opts - options for redis connection and creation of queue
 * @param {object} name - name of the server
 * @param {object} methods - supported methods for this server
 *
 * @returns {object} with property queue and method send
 */
export default function createWorker(opts, name, methods) {
  log('Creating worker for', name);
  // const queue = kue.createQueue({
  //   prefix: opts.prefix || 'q',
  //   redis: {
  //     port: opts.redis.port || 6379,
  //     host: opts.redis.host || '127.0.0.1',
  //     auth: opts.redis.auth || '',
  //     db: opts.redis.db,
  //     options: opts.redis.options,
  //   },
  //   disableSearch: true,
  // });
  const queue = kue.createQueue(opts);

  queue.process(name, opts.concurrency || 1, function (job, done) {
    const serverMethod = job.data.__serverMethod;
    if (!methods.hasOwnProperty(serverMethod)) {
      done('This method does not support by this server');
    }
    job.data.req.user = deserializeParseObject(job.data.req.user);

    methods[serverMethod](job.data.req, done);
  });

  queue.on('job complete', function (id) {
    kue.Job.get(id, function (err, job){
      if (err) { return; }
      job.remove(function (err){
        if (err) { throw err; }
        log('removed completed job #%d', job.id);
      });
    });
  });

  queue.on('job failed', function (id) {
    kue.Job.get(id, function (err, job){
      if (err) { return; }
      job.remove(function (err){
        if (err) { throw err; }
        log('removed completed job #%d', job.id);
      });
    });
  });

  return queue;
}

