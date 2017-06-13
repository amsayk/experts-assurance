import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const appSelector = state => state.get('app');

export default createSelector(
  userSelector,
  appSelector,
  (user, app) => ({ user, timelineDisplayMatches : app.timelineDisplayMatches })
);

