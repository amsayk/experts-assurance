import React from 'react';

import dataIdFromObject from 'dataIdFromObject';

import { IntlProvider } from 'react-intl';

import ApolloClient, { toIdValue } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import { renderToStringWithData } from 'react-apollo';
import { RouterContext } from 'react-router';

import { createLocalInterface } from 'apollo-local-query';
import schema from 'data/schema';

import getCurrentUser from 'getCurrentUser';

// Connectors
import { UserConnector } from 'data/user/connector';
import { BusinessConnector } from 'data/business/connector';
import { ProductConnector } from 'data/catalog/connector';

// Models
import { Users } from 'data/user/models';
import { Business } from 'data/business/models';
import { Products } from 'data/catalog/models';

const graphql = require('graphql');

const log = require('log')('app:backend:ssr');

export default function createRenderEngine(app) {
  return async ({ renderProps, req, res, store }) => {
    const user = getCurrentUser();
    const networkInterface = createLocalInterface(graphql, schema, {
      context: {
        user,
        Users: new Users({ user, connector: new UserConnector() }),
        Business: new Business({ user, connector: new BusinessConnector() }),
        Products: new Products({ user, connector: new ProductConnector() }),
      },
    });
    const client = new ApolloClient({
      ssrMode: true,
      addTypename: true,
      // Remember that this is the interface the SSR server will use to connect to the
      // API server, so we need to ensure it isn't firewalled, etc
      networkInterface,
      customResolvers: {
        Query: {
          Query: {
            getProduct: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Product', id })),
          },
        },
      },
      dataIdFromObject,
    });

    const app = (
      <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
        <ApolloProvider client={client} store={store} immutable>
          <RouterContext {...renderProps}/>
        </ApolloProvider>
      </IntlProvider>
    );

    try {
      const content = await renderToStringWithData(app);
      const apolloState = client.store.getState()[client.reduxRootKey];

      return {
        html: content,
        appState: JSON.stringify(store.getState().toJS()),
        apolloState: JSON.stringify({ [client.reduxRootKey]: { data: apolloState.data } }),
      };
    } catch (e) {
      log.error('RENDERING ERROR:', e);
      throw e;
    }
  };
}

