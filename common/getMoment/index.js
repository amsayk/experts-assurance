import invariant from 'invariant';

import moment from 'moment';

export default function getMoment(locale, createFn = m => m) {
  invariant(locale, 'Must provide a valid locale to getMoment');
  const fn = createFn(moment);
  invariant(fn, 'Must provide a valid create function to getMoment');
  return (...args) => fn(...args).locale(locale);
}
