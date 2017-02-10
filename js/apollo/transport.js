import {
  HTTPBatchedNetworkInterface,
} from 'apollo-client/transport/batchedNetworkInterface';

import queryMap from 'extracted_queries';

import {
  getQueryDocumentKey,
} from './common';

import objectAssign from 'object-assign';

import {
  PERSISTED_QUERIES,
  APOLLO_QUERY_BATCH_INTERVAL,
} from 'vars';

class NetworkInterface extends HTTPBatchedNetworkInterface {
  constructor({ uri, batchInterval, opts, queryMap, enablePersistedQueries }) {
    super(uri, batchInterval, opts);

    this.queryMap = queryMap;
    this.enablePersistedQueries = enablePersistedQueries;
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

  batchedFetchFromRemoteEndpoint(
    requestsAndOptions,
  ) {
    // If we are not in an enablePersistedQueries environment, this should just use the
    // standard network interface.
    if (!this.enablePersistedQueries) {
      return super.fetchFromRemoteEndpoint({ request, options });
    }

    const options = {};

    // Combine all of the options given by the middleware into one object.
    requestsAndOptions.forEach((requestAndOptions) => {
      objectAssign(options, requestAndOptions.options);
    });

    // Serialize the requests to strings of JSON
    const printedRequests = requestsAndOptions.map(({ request }) => {
      const queryDocument = request.query;
      const queryKey = getQueryDocumentKey(queryDocument);
      if (!this.queryMap[queryKey]) {
        throw new Error('Could not find query inside query map.');
      }
      const serverRequest = {
        id: this.queryMap[queryKey],
        variables: request.variables,
        operationName: request.operationName,
      };
      return serverRequest;
    });

    return fetch(this._uri, {
      ...this._opts,
      body: JSON.stringify(printedRequests),
      method: 'POST',
      ...options,
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };
}

export default function getNetworkInterface(apiUrl = '/graphql', headers = {}) {
  const batchInterval = APOLLO_QUERY_BATCH_INTERVAL
    ? parseInt(APOLLO_QUERY_BATCH_INTERVAL, 10)
    : 10;
  return new NetworkInterface({
    queryMap,
    uri: apiUrl,
    batchInterval,
    opts: {
      credentials: 'same-origin',
      headers,
    },
    enablePersistedQueries: PERSISTED_QUERIES,
  });
}

