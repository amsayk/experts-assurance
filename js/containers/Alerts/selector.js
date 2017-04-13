import { createSelector } from 'utils/reselect';

const appSelector = state => state.get('app');
const scrollingSelector = state => state.get('scrolling');

export default createSelector(
  appSelector,
  scrollingSelector,
  (app, scrolling) => ({ isReady : app.isReady, scrolling }),
);

