import Parse from 'parse';
import { createSelector } from 'utils/reselect';

const isAuthenticatedSelector = state => !state.get('user').isEmpty();
const queryParamsSelector = (_, { location }) => ({
  error    : location.query.error,
  token    : location.query.token,
  username : location.query.username,
  action   : Parse.serverURL + '/apps/' + location.query.id + '/request_password_reset',
});

export default createSelector(
  isAuthenticatedSelector,
  queryParamsSelector,
  (isAuthenticated, params) => ({ isAuthenticated, ...params })
);

