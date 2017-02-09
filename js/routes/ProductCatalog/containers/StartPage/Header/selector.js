import { createSelector } from 'utils/reselect';

import pick from 'lodash.pick';

const catalogSelector = state => state.get('catalog');
const appSelector = state => state.get('app');

export default createSelector(
  catalogSelector,
  appSelector,
  (catalog, app) => ({
    catalog : pick(catalog, ['adding', 'searchOpen', 'sideMenuOpen', 'viewType']),
    app     : pick(app, ['alertsOpen', 'isReady']),
  }),
);

