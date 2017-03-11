import { createSelector } from 'utils/reselect';

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
    queryString : users.queryString,
    searchOpen  : users.searchOpen,
    app,
    scrolling,
    notificationOpen,
  }),
);

