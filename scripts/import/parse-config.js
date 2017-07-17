const Parse = require('parse/node');
const config = require('../../build/config');

Parse.initialize(
  process.env.APPLICATION_ID,
  process.env.JAVASCRIPT_KEY,
  process.env.MASTER_KEY
);

Parse.CoreManager.set(
  'REQUEST_ATTEMPT_LIMIT', 0
);

Parse.serverURL = config.parse_server_url || `http://localhost:${config.server_port}${config.parse_server_mount_point}`; // eslint-disable-line max-len

