import { MongoClient, GridFSBucket, Db } from 'mongodb';
import { FilesAdapter } from 'parse-server/lib/Adapters/Files/FilesAdapter';

import config from 'build/config';

import emptyFunction from 'emptyFunction';

const log = require('log')('app:backend:files');

export class GridFSAdapter extends FilesAdapter {
  _databaseURI: string;
  _connectionPromise: Promise<Db>;

  constructor(
    mongoDatabaseURI = config.parse_database_uri ||
      `mongodb://localhost:27017/${config.appName}`,
  ) {
    super();
    this._databaseURI = mongoDatabaseURI;

    log('constructor', this._databaseURI);
  }

  _connect() {
    if (!this._connectionPromise) {
      this._connectionPromise = MongoClient.connect(this._databaseURI);
    }
    log('_connect', this._connectionPromise);
    return this._connectionPromise;
  }

  // For a given config object, filename, and data, store a file
  // Returns a promise
  createFile(filename: string, data) {
    log('createFile', filename, data.length / 1024 / 1024);
    return this._connect().then(db => {
      const bucket = new GridFSBucket(db, {});

      const Readable = require('stream').Readable;
      const dataStream = new Readable();
      dataStream._read = emptyFunction; // redundant? see update below
      dataStream.push(data);
      dataStream.push(null);

      return new Promise((resolve, reject) => {
        dataStream
          .pipe(bucket.openUploadStream(filename))
          .on('error', function(err) {
            log.error('createFile', err);
            reject(err);
          })
          .on('end', function() {
            log.error('createFile success');
            resolve();
          });
      });
    });
  }

  deleteFile(filename: string) {
    return Promise.resolve();
  }

  getFileData(filename: string) {
    log('getFileData', filename);
    return this._connect().then(db => {
      const bucket = new GridFSBucket(db);
      const readable = bucket.openDownloadStreamByName(filename);

      return new Promise((resolve, reject) => {
        const chunks = [];

        readable.setEncoding('utf8');
        readable.on('data', chunk => {
          log('getFileData onData', chunk.length);
          chunks.push(chunk);
        });
        readable.on('end', () => {
          log('getFileData onEnd', chunks.length);
          resolve(chunks.join(''));
        });
        readable.on('error', err => {
          log.error('getFileData onError', err);
          reject(err);
        });
      });
    });
  }

  getFileLocation(config, filename) {
    return (
      config.mount +
      '/files/' +
      config.applicationId +
      '/' +
      encodeURIComponent(filename)
    );
  }

  getFileStream(filename: string) {
    log('getFileStream', filename);
    return this._connect().then(db => {
      const bucket = new GridFSBucket(db);
      return bucket.openDownloadStreamByName(filename);
    });
  }
}

export default GridFSAdapter;
