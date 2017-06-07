import { createSelector } from 'utils/reselect';

const dashboardSelector = (state) => state.get('dashboard');

export default createSelector(
  dashboardSelector,
  (dashboard) => {
    const { invalid } = dashboard;
    return ({
      isOpen         : invalid.visible,
      sortConfig     : invalid.sortConfig,
      category       : invalid.category,
    });
  },
);

