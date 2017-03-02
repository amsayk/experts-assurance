import { createSelector } from 'utils/reselect';

import { PATH_SETTINGS_BUSINESS_USER_PARAM } from 'vars';

const userSelector = state => state.get('user');
const userIdSelector = (_, { params }) => params[PATH_SETTINGS_BUSINESS_USER_PARAM];

export default createSelector(
  userSelector,
  userIdSelector,
  (user, id) => ({ user, userId : id })
);

