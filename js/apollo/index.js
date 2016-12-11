import ApolloClient from 'apollo-client';
import ResponseMiddlewareNetworkInterface from './response-middleware-network-interface';
const error = require('debug')('app:client:error');

import dataIdFromObject from 'dataIdFromObject';

import { GRAPHQL_ENDPOINT } from 'env';

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
        error(JSON.stringify(response.errors));
        alert(`There was an error in your GraphQL request: ${response.errors[0].message}`);
      }
    }
    next();
  },
});

export const client = new ApolloClient({
  networkInterface: responseMiddlewareNetworkInterface,
  addTypename: true,
  customResolvers: {
    Query: {
    },
  },
  dataIdFromObject,
});

