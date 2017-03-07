import { addLocaleData } from 'react-intl';
import moment from 'moment';

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
      }, 'Intl-EN.0');
    } else {
      require.ensure([], (require) => {
        addLocaleData(require('react-intl/locale-data/en.js'));
        callback({messages: {}}); // This is the default language
      }, 'INTL-EN');
    }
  },

  fr(callback, force) {
    moment.locale('fr');

    if (! window.Intl || force) {
      require.ensure([], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/fr.js');
        addLocaleData(require('react-intl/locale-data/fr.js'));
        callback({messages: {}});
      }, 'INTL-FR.0');
    } else {
      require.ensure([], (require) => {
        addLocaleData(require('react-intl/locale-data/fr.js'));
        callback({messages: {}});
      }, 'INTL-FR');
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

