import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const stateSelector = state => state.getIn(['cases', 'state']);

export default createSelector(
  userSelector,
  stateSelector,
  (user, state) => ({ user, state })
);

