import { createSelector } from 'utils/reselect';

import { PATH_SETTINGS_BUSINESS_USER_PARAM } from 'vars';

const userSelector = state => state.get('user');
const userIdSelector = (_, { params }) => params[PATH_SETTINGS_BUSINESS_USER_PARAM];
const notificationOpenSelector = (state) => state.getIn(['notification', 'options', 'active']);

export default createSelector(
  userSelector,
  userIdSelector,
  notificationOpenSelector,
  (user, id, notificationOpen) => ({ user, userId : id, notificationOpen })
);

