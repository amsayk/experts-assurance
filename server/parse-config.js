import Parse from 'parse/node';
import config from '../build/config';

Parse.initialize(
  process.env.APPLICATION_ID,
  process.env.JAVASCRIPT_KEY,
  process.env.MASTER_KEY
);

Parse.CoreManager.set(
  'REQUEST_ATTEMPT_LIMIT', 0
);

Parse.serverURL = config.parse_server_url || `http://${config.server_host}:${config.server_port}${config.parse_server_mount_point}`; // eslint-disable-line max-len

