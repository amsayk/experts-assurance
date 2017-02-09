import { isServer } from 'vars';

export default (s) => {
  if (isServer) {
    const getSlug = require('speakingurl');
    return Promise.resolve(getSlug(s));
  } else {
    return new Promise((resolve, reject) => {
      require.ensure([], (require) => {
        try {
          const getSlug = require('speakingurl');
          resolve(getSlug(s));
        } catch (e) {
          reject(e);
        }
      }, 'slug');
    });
  }
};

