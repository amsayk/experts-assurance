import { createSelector } from 'utils/reselect';

const appSelector = state => state.get('app');
const sortConfigSelector = state => state.getIn(['users', 'sortConfig']);
const rolesSelector = state => state.getIn(['users', 'roles']);

export default createSelector(
  appSelector,
  sortConfigSelector,
  rolesSelector,
  (app, sortConfig, roles) => ({ isReady : app.isReady, sortConfig, roles: roles ? roles.toJS() : [] })
);

