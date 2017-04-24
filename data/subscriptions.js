import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import schema from 'data/schema';

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    businessChanged: (options, { businessKey }) => ({
      businessChangedChannel: {
        filter: (business) => business.get('key') === businessKey,
      },
    }),

    // Docs
    addDoc: (options, {}) => ({
      addDocChannel: {
      },
    }),
    delDoc: (options, {}) => ({
      delDocChannel: {
      },
    }),
    restoreDoc: (options, {}) => ({
      restoreDocChannel: {
      },
    }),
    setManager: (options, {}) => ({
      docChangeChannel: {
      },
    }),
    setState: (options, {}) => ({
      docChangeChannel: {
      },
    }),

    // Auth
    authChanged: (options, { id }) => ({
      authChangedChannel: {
        filter: (user) => user.id === id,
      },
    }),
  },
});

export { subscriptionManager, pubsub };

