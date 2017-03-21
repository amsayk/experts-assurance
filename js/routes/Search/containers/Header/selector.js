import { createSelector } from 'utils/reselect';

const appSelector = state => state.get('app');
const notificationOpenSelector = (state) => state.getIn(['notification', 'options', 'active']);

export default createSelector(
  appSelector,
  notificationOpenSelector,
  (app, notificationOpen) => ({ app, notificationOpen }),
);

