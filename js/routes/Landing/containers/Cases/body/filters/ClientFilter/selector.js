import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const clientSelector = state => state.getIn(['cases', 'client']);

export default createSelector(
  userSelector,
  clientSelector,
  (user, client) => ({ user, client })
);

