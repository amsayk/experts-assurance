import { createSelector } from 'utils/reselect';

import pick from 'lodash.pick';

const appSelector = state => state.get('app');

export default createSelector(
  appSelector,
  (app) => ({
    isReady : app.isReady,
  }),
);

