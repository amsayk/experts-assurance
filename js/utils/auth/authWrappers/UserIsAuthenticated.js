import { PATH_LOGIN } from 'vars';
import { UserAuthWrapper } from 'redux-auth-wrapper';

const UserIsAuthenticated = UserAuthWrapper({
  wrapperDisplayName     : 'UserIsAuthenticated',
  authSelector           : state => state.get('user'),
  predicate              : (user) => !user.isEmpty(),
  failureRedirectPath    : PATH_LOGIN,
});

export default UserIsAuthenticated;

export const onEnter = (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  return connect(UserIsAuthenticated.onEnter);
};

