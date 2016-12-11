import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const notifySelector = (_, { location }) => location.state && location.state.notify;

export default createSelector(
  userSelector,
  notifySelector,
  (user, notify) => ({ user, notify })
);

