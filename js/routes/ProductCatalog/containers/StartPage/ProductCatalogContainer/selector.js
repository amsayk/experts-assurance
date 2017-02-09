import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const viewTypeSelector = state => state.getIn(['catalog', 'viewType']);
const sortConfigSelector = state => state.getIn(['catalog', 'sortConfig']);

export default createSelector(
  userSelector,
  viewTypeSelector,
  sortConfigSelector,
  (user, viewType, sortConfig) => ({ user, viewType, sortConfig })
);

