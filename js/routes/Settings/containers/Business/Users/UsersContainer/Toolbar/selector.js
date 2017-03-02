import { createSelector } from 'utils/reselect';

import pick from 'lodash.pick';

const usersSelector = state => state.get('users');
const appSelector = state => state.get('app');

export default createSelector(
  usersSelector,
  appSelector,
  (users, app) => ({
    users       : pick(users, ['searchOpen', 'viewType']),
    app,
  }),
);

