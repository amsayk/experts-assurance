import { createSelector } from 'utils/reselect';

const appSelector = state => state.get('app');

export default createSelector(
  appSelector,
  (app) => ({ isReady : app.isReady }),
);

