import { createSelector } from 'utils/reselect';

const dashboardSelector = (state) => state.get('dashboard');

export default createSelector(
  dashboardSelector,
  (dashboard) => {
    const { unpaid } = dashboard;
    return ({
      isOpen          : unpaid.visible,
      sortConfig      : unpaid.sortConfig,
      durationInDays  : unpaid.duration,
    });
  },
);

