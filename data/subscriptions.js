// import { RedisPubSub } from 'graphql-redis-subscriptions';
//
// const pubsub = new RedisPubSub({
//   // triggerTransform: (trigger, { path }) => [trigger, ...path].join('.'),
//   connection: {
//     retry_strategy: ({ attempt }) => Math.max(attempt * 100, 3000), // reconnect after
//   },
// });
//
// export { pubsub };

import { MQTTPubSub } from 'graphql-mqtt-subscriptions';

const pubsub = new MQTTPubSub();

export { pubsub };
