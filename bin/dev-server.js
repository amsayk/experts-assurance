import Parse from 'parse/node';
import config from 'build/config';
import { app, websocketServer } from 'server/main';

const log = require('log')('app:bin:server');

const port = config.server_port;

app.listen(port, async (err) => {
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

  log(`Server is now running at http://${config.server_host}:${port}.`);
});

const ws_port = config.ws_port;

websocketServer.listen(ws_port, () => log(
  `Websocket Server is now running on http://${config.server_host}:${ws_port}`
));

