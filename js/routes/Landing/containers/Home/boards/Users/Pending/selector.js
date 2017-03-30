import { createSelector } from 'utils/reselect';

const dashboardSelector = (state) => state.get('dashboard');

export default createSelector(
  dashboardSelector,
  (dashboard) => ({
    pendingDashboardIsOpen : dashboard.pending.visible,
    sortConfig             : dashboard.pending.sortConfig,
    durationInDays         : dashboard.pending.duration,
  }),
);

