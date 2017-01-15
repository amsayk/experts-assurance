import ApolloClient from 'apollo-client';
import { Client } from 'subscriptions-transport-ws';
import ResponseMiddlewareNetworkInterface from './response-middleware-network-interface';
const log = require('log')('app:client');

import dataIdFromObject from 'dataIdFromObject';

import { GRAPHQL_ENDPOINT, GRAPHQL_SUBSCRIPTIONS_ENDPOINT } from 'vars';

import addGraphQLSubscriptions from './subscriptions';

const wsClient = new Client(GRAPHQL_SUBSCRIPTIONS_ENDPOINT);

const responseMiddlewareNetworkInterface = new ResponseMiddlewareNetworkInterface(GRAPHQL_ENDPOINT, {
  credentials: 'same-origin',
});

// Sample error handling middleware
responseMiddlewareNetworkInterface.use({
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    next();
  },
  applyResponseMiddleware: (response, next) => {
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
    },
  },
  dataIdFromObject,
  initialState: window.__APOLLO_STATE__ || {},
});

