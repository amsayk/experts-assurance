import ApolloClient, { toIdValue, } from 'apollo-client';
import ResponseMiddlewareNetworkInterface from './response-middleware-network-interface';
const error = require('debug')('app:client:error');

import dataIdFromObject from 'dataIdFromObject';

const responseMiddlewareNetworkInterface = new ResponseMiddlewareNetworkInterface(process.env.GRAPHQL_ENDPOINT, {
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
        error(JSON.stringify(response.errors));
        alert(`There was an error in your GraphQL request: ${response.errors[0].message}`);
      }
    }
    next();
  }
});

export const client = new ApolloClient({
  initialState: window.__APOLLO_STATE__,
  ssrForceFetchDelay: process.env.SSR ? 100 : 0,
  networkInterface: responseMiddlewareNetworkInterface,
  addTypename: true,
  customResolvers: {
    Query: {
    },
  },
  dataIdFromObject,
});

