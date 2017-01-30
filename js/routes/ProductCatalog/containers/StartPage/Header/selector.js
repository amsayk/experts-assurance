import { createSelector } from 'utils/reselect';

const catalogSelector = state => state.get('catalog');
const appSelector = state => state.get('app');

export default createSelector(
  catalogSelector,
  appSelector,
  (catalog, app) => ({ catalog, app }),
);

