import { createSelector } from 'utils/reselect';

const rolesSelector = (state) => state.getIn(['users', 'roles']);

export default createSelector(
  rolesSelector,
  (roles) => ({ roles : roles ? roles.toJS() : [] }),
);

