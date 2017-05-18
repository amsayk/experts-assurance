import { ApolloClient } from 'apollo-client';

import dataIdFromObject from 'dataIdFromObject';

import { createLocalInterface } from 'apollo-local-query';
import schema from 'data/schema';

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

export default function createApolloClient (user) {
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
    connectToDevTools : false,
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    networkInterface,
    customResolvers: {
      Query: {
        getUser : (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'User', id })),
        getDoc  : (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Doc', id })),
        getFile : (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'File', id })),

      },
    },
    dataIdFromObject,
  });

  return client;
};

