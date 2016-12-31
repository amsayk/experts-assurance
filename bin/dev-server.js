import Parse from 'parse/node';
import config from 'build/config';
import server from 'server/main';

const debug = require('debug')('app:bin:server');
const error = require('debug')('app:bin:server:error');

const port = config.server_port;

server.listen(port, async (err) => {

  if (err) {
    throw err;
  }

  try {
    await Promise.all([
      Parse.Cloud.run('initialization'),
      Parse.Cloud.run('initUsers'),
    ]);
    debug('Server initialized.');
  } catch (e) {
    error('Error initializing server:', e);
    throw e;
  }

  debug(`Server is now running at http://localhost:${port}.`);
});

