import { createSelector } from 'utils/reselect';

const dashboardSelector = (state) => state.get('dashboard');

export default createSelector(
  dashboardSelector,
  (dashboard) => ({
    closedDashboardIsOpen : dashboard.closed.visible,
    includeCanceled       : dashboard.closed.includeCanceled,
    sortConfig            : dashboard.closed.sortConfig,
    durationInDays        : dashboard.closed.duration,
  }),
);

