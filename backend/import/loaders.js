import Parse from 'parse/node';

import DataLoader from 'dataloader';

import { businessQuery } from 'data/utils';

// export const usernames = new DataLoader(async function (keys) {
//   const objects = await new Parse.Query(Parse.User)
//     .containedIn('username', keys)
//     .find({ useMasterKey: true });
//
//   return keys.map((username) => {
//     const index = objects.findIndex((object) => object.get('username') === username);
//     return index !== -1 ? objects[index] : new Error(`User ${username} not found`);
//   });
// });

export const displayNames = new DataLoader(async function (keys) {
  const objects = await new Parse.Query(Parse.User)
    .matchesQuery('business', businessQuery())
    .containedIn('displayName', keys)
    .find({ useMasterKey: true });

  return keys.map((displayName) => {
    const index = objects.findIndex((object) => object.get('displayName') === displayName);
    return index !== -1 ? objects[index] : new Error(`User ${displayName} not found`);
  });
}, {
  batch : false,
});

