import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const viewTypeSelector = state => state.getIn(['users', 'viewType']);

export default createSelector(
  userSelector,
  viewTypeSelector,
  (user, viewType) => ({ user, viewType })
);

