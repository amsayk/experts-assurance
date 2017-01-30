import { createSelector } from 'utils/reselect';

const getSnackbar = (state) => state.get('snackbar');

export default createSelector(
  [getSnackbar],
  (snackbar) => ({ snackbar })
);

