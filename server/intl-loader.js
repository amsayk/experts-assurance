import { addLocaleData } from 'react-intl';
const debug = require('debug')('app:server:intl');

const loaders = {
  en() {
    addLocaleData(require('react-intl/locale-data/en.js'));
    return { messages: {} }; // This is the default language.
  }

};

module.exports = (locale) => {
  let fn = loaders[locale];
  if (!fn) {
    debug(`No loader for locale: ${locale}, Falling back to default lang`);
    fn = loaders.en;
  }
  return fn();
};

