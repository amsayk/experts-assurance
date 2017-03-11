import { createSelector } from 'utils/reselect';

import pick from 'lodash.pick';

const usersSelector = state => state.get('users');
const appSelector = state => state.get('app');
const scrollingSelector = (state) => state.get('scrolling');
const notificationOpenSelector = (state) => state.getIn(['notification', 'options', 'active']);

export default createSelector(
  usersSelector,
  appSelector,
  scrollingSelector,
  notificationOpenSelector,
  (users, app, scrolling, notificationOpen) => ({
    users : pick(users, ['searchOpen', 'viewType']),
    app,
    scrolling,
    notificationOpen,
  }),
);

