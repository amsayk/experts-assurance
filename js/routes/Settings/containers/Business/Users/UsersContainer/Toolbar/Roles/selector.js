import { createSelector } from 'utils/reselect';

const roleSelector = (state) => state.getIn(['users', 'role']);

export default createSelector(
  roleSelector,
  (role) => ({ role }),
);

