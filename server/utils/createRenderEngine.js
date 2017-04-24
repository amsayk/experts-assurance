import React from 'react';

import Helmet from 'react-helmet';

import dataIdFromObject from 'dataIdFromObject';

import { IntlProvider } from 'react-intl';

import ApolloClient, { toIdValue } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import { renderToStringWithData } from 'react-apollo';
import { RouterContext } from 'react-router';

import { createLocalInterface } from 'apollo-local-query';
import schema from 'data/schema';

import getCurrentUser from 'getCurrentUser';

import emptyObject from 'emptyObject';

// Connectors
import { UserConnector } from 'data/user/connector';
import { BusinessConnector } from 'data/business/connector';
import { DocConnector } from 'data/doc/connector';
import { ActivityConnector } from 'data/activity/connector';

// Models
import { Users } from 'data/user/models';
import { Business } from 'data/business/models';
import { Docs } from 'data/doc/models';
import { Activities } from 'data/activity/models';

import { APOLLO_DEFAULT_REDUX_ROOT_KEY } from 'vars';

const graphql = require('graphql');

const log = require('log')('app:backend:ssr');

export default function createRenderEngine(app) {
  return async ({ renderProps, req, res, store }) => {
    const user = getCurrentUser();
    const networkInterface = createLocalInterface(graphql, schema, {
      context: {
        user,
        Users      : new Users({ user, connector: new UserConnector() }),
        Business   : new Business({ user, connector: new BusinessConnector() }),
        Docs       : new Docs({ user, connector: new DocConnector() }),
        Activities : new Activities({ user, connector: new ActivityConnector() }),
        Now        : Date.now(),
      },
    });
    const client = new ApolloClient({
      connectToDevTools : __DEV__,
      ssrMode: true,
      // Remember that this is the interface the SSR server will use to connect to the
      // API server, so we need to ensure it isn't firewalled, etc
      networkInterface,
      customResolvers: {
        Query: {
          getUser: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'User', id })),
          getDoc: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Doc', id })),
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
      const { title } = Helmet.rewind();

      // store is not always present
      const apolloState = client.store
        ? client.store.getState()[APOLLO_DEFAULT_REDUX_ROOT_KEY]
        : { data: emptyObject };

      return {
        title       : title.toString(),
        html        : content,
        appState    : JSON.stringify(store.getState().toJS()),
        apolloState : JSON.stringify({ [APOLLO_DEFAULT_REDUX_ROOT_KEY]: { data: apolloState.data } }),
      };
    } catch (e) {
      log.error('RENDERING ERROR:', e);
      throw e;
    }
  };
}

