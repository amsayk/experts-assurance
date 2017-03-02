import { createSelector } from 'utils/reselect';

const appSelector = state => state.get('app');
const sortConfigSelector = state => state.getIn(['users', 'sortConfig']);
const roleSelector = state => state.getIn(['users', 'role']);

export default createSelector(
  appSelector,
  sortConfigSelector,
  roleSelector,
  (app, sortConfig, role) => ({ isReady : app.isReady, sortConfig, role })
);

