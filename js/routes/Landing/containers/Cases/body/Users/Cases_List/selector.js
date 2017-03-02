import { createSelector } from 'utils/reselect';

import pick from 'lodash.pick';

const appSelector = state => state.get('app');
const docsSelector = state => state.get('cases');

export default createSelector(
  appSelector,
  docsSelector,
  (app, docs) => ({ isReady : app.isReady, ...pick(docs, ['sortConfig', 'client', 'insurer', 'state']) })
);

