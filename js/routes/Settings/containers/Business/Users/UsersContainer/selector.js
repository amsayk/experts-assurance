import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const viewTypeSelector = state => state.getIn(['users', 'viewType']);
const notificationOpenSelector = (state) => state.getIn(['notification', 'options', 'active']);

export default createSelector(
  userSelector,
  viewTypeSelector,
  notificationOpenSelector,
  (user, viewType, notificationOpen) => ({ user, viewType, notificationOpen })
);

