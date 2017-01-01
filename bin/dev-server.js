import Parse from 'parse/node';
import config from 'build/config';
import server from 'server/main';

const log = require('log')('app:bin:server');

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
    log('Server initialized.');
  } catch (e) {
    log.error('Error initializing server:', e);
    throw e;
  }

  log(`Server is now running at http://localhost:${port}.`);
});

