import { createSelector } from 'utils/reselect';

const notificationOpenSelector = (state) => state.getIn(['notification', 'options']).active;

export default createSelector(
  notificationOpenSelector,
  (notificationOpen) => ({ notificationOpen })
);

