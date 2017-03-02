import { createSelector } from 'utils/reselect';

const usersSelector = state => state.get('users');
const appSelector = state => state.get('app');

export default createSelector(
  usersSelector,
  appSelector,
  (users, app) => ({
    queryString : users.queryString,
    searchOpen  : users.searchOpen,
    app,
  }),
);

