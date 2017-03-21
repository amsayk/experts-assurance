import { createSelector } from 'utils/reselect';

const appSelector = state => state.get('app');
const isActiveSelector = state => state.getIn(['docSearch', 'active']);
const scrollingSelector = (state) => state.get('scrolling');
const notificationOpenSelector = (state) => state.getIn(['notification', 'options', 'active']);

export default createSelector(
  appSelector,
  isActiveSelector,
  scrollingSelector,
  notificationOpenSelector,
  (app, isActive, scrolling, notificationOpen) => ({ app, searching : isActive, scrolling, notificationOpen }),
);

