import { addLocaleData } from 'react-intl';
import debug from 'log';

const log = debug('app:client:intl');

const loaders = {
  en(callback, force) {
    if (!window.Intl || force) {
      require.ensure([], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/en.js');
        addLocaleData(require('react-intl/locale-data/en.js'));
        callback({messages: {}});
      }, 'intl-loader-en-0');
    } else {
      require.ensure([], (require) => {
        addLocaleData(require('react-intl/locale-data/en.js'));
        callback({messages: {}}); // This is the default language
      }, 'intl-loader-en');
    }
  },

  fr(callback, force) {
    if (! window.Intl || force) {
      require.ensure([], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/fr.js');
        addLocaleData(require('react-intl/locale-data/fr.js'));
        callback({messages: {}});
      }, 'intl-loader-fr-0');
    } else {
      require.ensure([], (require) => {
        addLocaleData(require('react-intl/locale-data/fr.js'));
        callback({messages: {}});
      }, 'intl-loader-fr');
    }
  }
};

export default (locale, force = false) => {
  return new Promise((resolve) => {
    let fn = loaders[locale];
    if (!fn) {
      log(`No loader for locale: ${locale}, Falling back to default lang`);
      fn = loaders.en;
    }
    fn(resolve, force);
  });
};

