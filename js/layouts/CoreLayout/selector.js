import { createSelector } from 'utils/reselect';

const displayMatches = (state) => state.getIn(['app', 'displayMatches']);
const onLine = (state) => state.getIn(['app', 'onLine']);

export default createSelector(
  [displayMatches, onLine],
  (displayMatches, onLine) => ({ displayMatches, onLine })
);

