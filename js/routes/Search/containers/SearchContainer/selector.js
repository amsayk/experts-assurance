import { createSelector } from 'utils/reselect';

const appSelector = state => state.get('app');
const docSearchSelector = state => state.get('docSearch');
const userSelector = state => state.get('user');

export default createSelector(
  appSelector,
  docSearchSelector,
  userSelector,
  (app, docSearch, user) => ({ isReady : app.isReady, search: docSearch, user, skip: false })
);

