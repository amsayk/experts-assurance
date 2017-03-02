import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const insurerSelector = state => state.getIn(['cases', 'insurer']);

export default createSelector(
  userSelector,
  insurerSelector,
  (user, insurer) => ({ user, insurer })
);

