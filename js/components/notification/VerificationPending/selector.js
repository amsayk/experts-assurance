import { createSelector } from 'utils/reselect';

const getUser = (state) => state.get('user').toJS();

export default createSelector(
  [getUser],
  (user) => ({ user })
);

