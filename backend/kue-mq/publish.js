import kue from 'kue';

import config from 'build/config';

import { serializeParseObject } from 'backend/utils';

const log = require('log')('app:backend:mq:frontend');

/**
 * send message to kue-mq server
 * @param {string} serverName - name of the server
 * @param {string} serverMethod - method of the server
 * @param {object} data - data for method
 * @param {object} options - options
 *
 * @returns Promise
 */
export default function publish(serverName, serverMethod, req, options = {}) {
  return new Promise(function (resolve, reject) {
    const data = {
      req,
      __serverMethod : serverMethod,
    };

    const job = config.queue.create(serverName, data);

    const clearJob = function () {
      job.remove(function (err) {
        if (err) { throw err; }
        log('removed completed job #%d', job.id);
      });
    };

    const timeoutCall = setTimeout(function () {
      reject('Timeout error by call of ' + serverMethod);
      clearJob();
    }, options.timeout || (30 * 1000));

    job.on('failed', function (err) {
      log(`Job #${job.id} failed.`, err);
      clearTimeout(timeoutCall);
      reject(err);
    });

    job.on('complete', function (result, err) {
      clearTimeout(timeoutCall);
      if (err) { return reject(err); }
      log(`Job #${job.id} completed successfully.`);
      resolve({
        data: result,
        job: job,
      });
    });

    job.save(function (err) {
      if (err) {
        clearTimeout(timeoutCall);
        log(`publish(${serverName}, ${serverMethod}) Job #${job.id} failed`);
        return reject(err);
      }
      log(`publish(${serverName}, ${serverMethod}) Job #${job.id}`);
    });

  });
};

