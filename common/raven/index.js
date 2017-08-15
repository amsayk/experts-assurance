import Raven from 'raven';

import config from 'build/config';

// Must configure Raven before doing anything else with it
Raven.config(config.sentryDSN, {
  environment: config.env,
  parseUser: ['id'],
}).install();

export default Raven;
