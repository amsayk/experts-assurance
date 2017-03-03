import { createSelector } from 'utils/reselect';

import { extrapolate } from './utils';

const extrapolationSelector = () => extrapolate();
const appSelector = (state) => state.get('app');

export default createSelector(
  extrapolationSelector,
  appSelector,
  (extrapolation, app) => ({ extrapolation, isReady: app.isReady, timelineDisplayMatches : app.timelineDisplayMatches })
);

