import ApolloClient, { toIdValue } from 'apollo-client';
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';
import getNetworkInterface from './transport';
import debug from 'log';

import dataIdFromObject from 'dataIdFromObject';

import { DEBUG, GRAPHQL_ENDPOINT, GRAPHQL_SUBSCRIPTIONS_ENDPOINT } from 'vars';

const log = debug('app:client');

const wsClient = new SubscriptionClient(GRAPHQL_SUBSCRIPTIONS_ENDPOINT, {
  connectionParams: {
    // Pass any arguments you want for initialization
  },
  reconnect: true,
  reconnectionAttempts: 5,
  connectionCallback: error => {},
});

const responseMiddlewareNetworkInterface = getNetworkInterface(
  GRAPHQL_ENDPOINT,
  {},
);

// Sample error handling middleware
responseMiddlewareNetworkInterface.use({
  applyBatchMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}; // Create the header object if needed.
    }
    next();
  },
  applyBatchAfterware(response, next) {
    if (response.errors) {
      if (typeof window !== 'undefined') {
        log.error(JSON.stringify(response.errors));
        alert(
          `There was an error in your GraphQL request: ${response.errors[0]
            .message}`,
        );
      }
    }
    next();
  },
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  responseMiddlewareNetworkInterface,
  wsClient,
);

export const client = new ApolloClient({
  connectToDevTools: __DEV__ || DEBUG,
  networkInterface: networkInterfaceWithSubscriptions,
  queryDeduplication: true,
  customResolvers: {
    Query: {
      getUser: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'User', id })),
      getDoc: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'Doc', id })),
      getImportation: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'Importation', id })),
      getActivity: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'Activity', id })),
      getFile: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'File', id })),
    },
  },
  dataIdFromObject,
  initialState: window.__APOLLO_STATE__ || {},
  batchMax: 10,
});
