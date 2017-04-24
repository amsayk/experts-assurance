import elasticsearch from 'elasticsearch';

import config from 'build/config';

export default new elasticsearch.Client({
  host: config.elasticsearch_host,
  // log: __DEV__ ? 'trace' : null,
});

