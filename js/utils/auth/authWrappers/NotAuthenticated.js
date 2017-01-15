import { UserAuthWrapper } from 'redux-auth-wrapper';

import isEmpty from 'isEmpty';

const NotAuthenticated = UserAuthWrapper({
  wrapperDisplayName     : 'NotAuthenticated',
  authSelector           : state => state.get('user').toJS(),
  predicate              : (user) => isEmpty(user),
  failureRedirectPath    : (_, { redirect }) => redirect || '/',
  allowRedirectBack      : false,
});

export default NotAuthenticated;

export const onEnter = (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  return connect(NotAuthenticated.onEnter);
};

