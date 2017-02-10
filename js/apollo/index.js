import ApolloClient, { toIdValue } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import getNetworkInterface from './transport';
const log = require('log')('app:client');

import dataIdFromObject from 'dataIdFromObject';

import {
  GRAPHQL_ENDPOINT,
  GRAPHQL_SUBSCRIPTIONS_ENDPOINT,
} from 'vars';

const wsClient = new SubscriptionClient(GRAPHQL_SUBSCRIPTIONS_ENDPOINT, {
  connectionParams: {
    // Pass any arguments you want for initialization
  },
  reconnect: true,
  reconnectionAttempts: 5,
  connectionCallback: (error) => {},
});

const responseMiddlewareNetworkInterface = getNetworkInterface(GRAPHQL_ENDPOINT, {
});

// Sample error handling middleware
responseMiddlewareNetworkInterface.use({
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    next();
  },
  applyAfterware: (response, next) => {
    if (response.errors) {
      if (typeof window !== 'undefined') {
        log.error(JSON.stringify(response.errors));
        alert(`There was an error in your GraphQL request: ${response.errors[0].message}`);
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
  networkInterface: networkInterfaceWithSubscriptions,
  addTypename: true,
  customResolvers: {
    Query: {
      getProduct: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Product', id })),
    },
  },
  dataIdFromObject,
  initialState: window.__APOLLO_STATE__ || {},
  queryDeduplication : true,
});

