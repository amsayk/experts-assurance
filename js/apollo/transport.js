import {
  HTTPBatchedNetworkInterface,
} from 'apollo-client/transport/batchedNetworkInterface';

import { addUploads } from './uploads';

import { addPersistedQueries } from 'persistgraphql';

import queryMap from 'persisted_queries';

import {
  PERSISTED_QUERIES,
  APOLLO_QUERY_BATCH_INTERVAL,
} from 'vars';

class NetworkInterface extends HTTPBatchedNetworkInterface {
  constructor({ uri, batchInterval, opts }) {
    super({ uri, batchInterval, opts });

  };

  use(responseMiddleware) {
    let responseMiddlewares = responseMiddleware;
    if (!Array.isArray(responseMiddlewares)) {
      responseMiddlewares = [responseMiddlewares];
    }
    responseMiddlewares.forEach((middleware) => {
      if (typeof middleware.applyMiddleware === 'function') {
        super.use([middleware]);
      }

      if (typeof middleware.applyAfterware === 'function') {
        super.useAfter([middleware]);
      }
    });
  }

}

export default function getNetworkInterface(apiUrl = '/graphql', headers = {}) {
  const batchInterval = APOLLO_QUERY_BATCH_INTERVAL
    ? parseInt(APOLLO_QUERY_BATCH_INTERVAL, 10)
    : 10;
  const iface = new NetworkInterface({
    uri: apiUrl,
    batchInterval,
    opts: {
      credentials: 'same-origin',
      headers,
    },
  });

  if (PERSISTED_QUERIES) {
    return addPersistedQueries(iface, queryMap);
  }

  return addUploads(iface);
}

