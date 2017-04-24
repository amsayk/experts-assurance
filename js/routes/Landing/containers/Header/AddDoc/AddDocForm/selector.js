import { createSelector } from 'utils/reselect';

const appSelector = state => state.get('app');
const langSelector = state => state.getIn(['intl', 'locale']);

export default createSelector(
  appSelector,
  langSelector,
  (app, lang) => ({ addingDoc : app.addingDoc, lang }),
);

