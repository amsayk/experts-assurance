import { createSelector } from 'utils/reselect';

const dashboardSelector = (state) => state.get('dashboard');

export default createSelector(
  dashboardSelector,
  (dashboard) => ({
    isOpen         : dashboard.invalid.visible,
    sortConfig     : dashboard.invalid.sortConfig,
    category       : dashboard.invalid.category,
  }),
);

