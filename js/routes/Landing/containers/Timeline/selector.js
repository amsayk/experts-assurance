import { createSelector } from 'utils/reselect';

import { extrapolate } from 'routes/Landing/utils';

const extrapolationSelector = state =>
  extrapolate(/*locale = */ state.getIn(['intl']).localeWithFallback);
const appSelector = state => state.get('app');
const notificationOpenSelector = state =>
  state.getIn(['notification', 'options']).active;

export default createSelector(
  extrapolationSelector,
  appSelector,
  notificationOpenSelector,
  (extrapolation, app, notificationOpen) => ({
    extrapolation,
    notificationOpen,
    isReady: app.isReady,
    timelineDisplayMatches: app.timelineDisplayMatches,
  }),
);
