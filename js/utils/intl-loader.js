import { addLocaleData } from 'react-intl';
const debug = require('debug')('app:client:intl');

const loaders = {
  en(callback, force) {
    if (!window.Intl || force) {
      require.ensure([], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/en.js');
        addLocaleData(require('react-intl/locale-data/en.js'));
        callback({messages: {}}); // This is the default language
      });
    } else {
      require.ensure([], (require) => {
        addLocaleData(require('react-intl/locale-data/en.js'));
        callback({messages: {}}); // This is the default language
      });
    }
  },

};

export default (locale, force = false) => {
  return new Promise((resolve) => {
    let fn = loaders[locale];
    if (!fn) {
      debug(`No loader for locale: ${locale}, Falling back to default lang`);
      fn = loaders.en;
    }
    fn(resolve, force);
  });
};

