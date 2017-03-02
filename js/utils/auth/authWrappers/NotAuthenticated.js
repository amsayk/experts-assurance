import { UserAuthWrapper } from 'redux-auth-wrapper';

const NotAuthenticated = UserAuthWrapper({
  wrapperDisplayName     : 'NotAuthenticated',
  authSelector           : state => state.get('user'),
  predicate              : (user) => user.isEmpty,
  failureRedirectPath    : (_, { location }) => {
    const redirect = location.query && location.query.redirect;
    return redirect || '/';
  },
  allowRedirectBack      : false,
});

export default NotAuthenticated;

export const onEnter = (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  return connect(NotAuthenticated.onEnter);
};

