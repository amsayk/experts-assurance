import { createSelector } from 'utils/reselect';

const dashboardSelector = (state) => state.get('dashboard');

export default createSelector(
  dashboardSelector,
  (dashboard) => ({
    isOpen          : dashboard.unpaid.visible,
    sortConfig      : dashboard.unpaid.sortConfig,
    durationInDays  : dashboard.unpaid.duration,
  }),
);

