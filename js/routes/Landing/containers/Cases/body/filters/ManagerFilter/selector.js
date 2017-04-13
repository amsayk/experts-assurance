import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const managerSelector = state => state.getIn(['cases', 'manager']);

export default createSelector(
  userSelector,
  managerSelector,
  (user, manager) => ({ user, manager })
);

