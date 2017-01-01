import { addLocaleData } from 'react-intl';
import areIntlLocalesSupported from 'intl-locales-supported';
const log = require('log')('app:server:intl');

const localesMyAppSupports = [
  'en',
];

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(localesMyAppSupports)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and patch the constructors we need with the polyfill's.
    const IntlPolyfill    = require('intl');
    Intl.NumberFormat     = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat   = IntlPolyfill.DateTimeFormat;
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require('intl');
}

const loaders = {
  en() {
    addLocaleData(require('react-intl/locale-data/en.js'));
    return { messages: {} }; // This is the default language.
  },

};

module.exports = (locale) => {
  let fn = loaders[locale];
  if (!fn) {
    log(`No loader for locale: ${locale}, Falling back to default lang`);
    fn = loaders.en;
  }
  return fn();
};

