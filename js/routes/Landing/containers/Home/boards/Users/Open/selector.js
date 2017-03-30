import { createSelector } from 'utils/reselect';

const dashboardSelector = (state) => state.get('dashboard');

export default createSelector(
  dashboardSelector,
  (dashboard) => ({
    openDashboardIsOpen : dashboard.open.visible,
    onlyValidOpen       : dashboard.open.onlyValidOpen,
    sortConfig          : dashboard.open.sortConfig,
    durationInDays      : dashboard.open.duration,
  }),
);

