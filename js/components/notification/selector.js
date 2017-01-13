import { createSelector } from 'utils/reselect';

const getNotification = (state) => state.get('notification').toJS();

export default createSelector(
  [getNotification],
  (notification) => ({ notification })
);


