import kue from 'kue';

const log = require('log')('app:backend:mq');

/**
 * Create new kue-mq server
 * @param {object} opts - options for redis connection and creation of queue
 * @param {object} name - name of the server
 * @param {object} methods - supported methods for this server
 *
 * @returns {object} with property queue and method send
 */
export default function (opts, name, methods) {

  const queue = kue.createQueue({
    prefix: opts.prefix || 'q',
    redis: {
      port: opts.redis.port || 6379,
      host: opts.redis.host || '127.0.0.1',
      auth: opts.redis.auth || '',
      db: opts.redis.db,
      options: opts.redis.options,
    },
    disableSearch: true,
  });

  queue.process(name, function (job, done) {
    const serverMethod = job.data.__serverMethod;
    if (!methods.hasOwnProperty(serverMethod)) {
      done('This method does not support by this server');
    }
    const req = job.data.req;
    if (req.user) {
      req.user = Parse.User.fromJSON(req.user);
    }
    methods[serverMethod](req, done);
  });


  /**
   * send message to kue-mq server
   * @param {string} serverName - name of the server
   * @param {string} serverMethod - method of the server
   * @param {object} data - data for method
   * @param {object} options - options
   *
   * @returns Promise
   */
  function send(serverName, serverMethod, data, options = {}) {
    return new Promise(function (resolve, reject) {
      data.__serverMethod = serverMethod;
      const job = queue.create(serverName, data);

      const clearJob = function () {
        job.remove(function (err) {
          if (err) { throw err; }
          log('removed completed job #%d', job.id);
        });
      };

      const timeoutCall = setTimeout(function () {
        reject('Timeout error by call of ' + serverMethod);
        clearJob();
      }, options.timeout || 7000);

      job.on('failed', function (err) {
        clearTimeout(timeoutCall);
        reject(err);
      });

      job.on('complete', function (result, err) {
        clearTimeout(timeoutCall);
        if (err) { return reject(err); }
        resolve({
          data: result,
          job: job,
        });
      });

      job.save(function (err) {
        if (err) {
          clearTimeout(timeoutCall);
          reject(err);
        }
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
    });
  };

  return {
    queue: queue,
    send: send,
  };

};

