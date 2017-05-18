import elasticsearch from 'elasticsearch';

import config from 'build/config';

export default new elasticsearch.Client({
  hosts: [
    config.elasticsearch_host_1,
  ],
  // log: __DEV__ ? 'trace' : null,
});

