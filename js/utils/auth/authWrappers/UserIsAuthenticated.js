import { userHasRoleAll, Role_ADMINISTRATORS } from 'roles';

import getCurrentUser from 'getCurrentUser';

import { compose } from 'redux';

import { PATH_LOGIN, PATH_ACTIVATION, PATH_AUTHORIZATION } from 'vars';
import { UserAuthWrapper } from 'redux-auth-wrapper';

export const UserIsAuthenticated = UserAuthWrapper({
  wrapperDisplayName     : 'UserIsAuthenticated',
  authSelector           : state => state.get('user'),
  predicate              : (user) => !user.isEmpty,
  failureRedirectPath    : PATH_LOGIN,
})

UserIsAuthenticated._onEnter = UserIsAuthenticated.onEnter;
UserIsAuthenticated.onEnter = (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  return connect(UserIsAuthenticated._onEnter);
};;

export const EmailIsVerified = UserAuthWrapper({
  wrapperDisplayName     : 'EmailIsVerified',
  authSelector           : state => state.get('user'),
  predicate              : () => {
    const user = getCurrentUser();
    if (user) {
      return !user.get('emailVerified');
    }
    return false;
  },
  failureRedirectPath    : (_, { location }) => {
    const redirect = location.query && location.query.redirect;
    return redirect || '/';
  },
  allowRedirectBack      : false,
});

EmailIsVerified._onEnter = EmailIsVerified.onEnter;
EmailIsVerified.onEnter = (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  return connect(EmailIsVerified._onEnter);
};

export const UserIsAuthorized = UserAuthWrapper({
  wrapperDisplayName     : 'UserIsAuthorized',
  authSelector           : state => state.get('user'),
  predicate              : () => {
    const user = getCurrentUser();
    if (
      user &&
      !userHasRoleAll(user, Role_ADMINISTRATORS)
    ) {
      return !(user.get('authorization_date') && user.get('authorization_user'));
    }
    return false;
  },
  failureRedirectPath    : (_, { location }) => {
    const redirect = location.query && location.query.redirect;
    return redirect || '/';
  },
  allowRedirectBack      : false,
});

UserIsAuthorized._onEnter = UserIsAuthorized.onEnter;
UserIsAuthorized.onEnter = (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  return connect(UserIsAuthorized._onEnter);
};

export const UserIsNotAuthorized = UserAuthWrapper({
  wrapperDisplayName     : 'UserIsNotAuthorized',
  authSelector           : state => state.get('user'),
  predicate              : () => {
    const user = getCurrentUser();
    if (
      user &&
      !userHasRoleAll(user, Role_ADMINISTRATORS)
    ) {
      return !!(user.get('authorization_date') && user.get('authorization_user'));
    }
    return true;
  },
  failureRedirectPath    : PATH_AUTHORIZATION,
  allowRedirectBack      : false,
});

UserIsNotAuthorized._onEnter = UserIsNotAuthorized.onEnter;
UserIsNotAuthorized.onEnter = (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  return connect(UserIsNotAuthorized._onEnter);
};

export const EmailIsNotVerified = UserAuthWrapper({
  wrapperDisplayName     : 'EmailIsNotVerified',
  authSelector           : state => state.get('user'),
  predicate              : () => {
    const user = getCurrentUser();
    if (user) {
      return user.get('emailVerified');
    }
    return true;
  },
  failureRedirectPath    : PATH_ACTIVATION,
  allowRedirectBack      : false,
});

EmailIsNotVerified._onEnter = EmailIsNotVerified.onEnter;
EmailIsNotVerified.onEnter = (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  return connect(EmailIsNotVerified._onEnter);
};

export default compose(
  UserIsAuthenticated,
  EmailIsNotVerified,
  UserIsNotAuthorized,
);

export const onEnter = (store) => connect(store)(
  UserIsAuthenticated._onEnter,
  EmailIsNotVerified._onEnter,
  UserIsNotAuthorized._onEnter,
);

export const connect = (store) => (...components) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  //This executes the parent onEnter first, going from left to right.
  // `replace` has to be wrapped because we want to stop executing `onEnter` hooks
  // after the first call to `replace`.
  const onEnterChain = (...listOfOnEnters) => (store, nextState, replace) => {
    let redirected = false;
    const wrappedReplace = (...args) => {
      replace(...args);
      redirected = true;
    };
    listOfOnEnters.forEach((onEnter) => {
      if (!redirected) {
        onEnter(store, nextState, wrappedReplace);
      }
    });
  };
  return connect(onEnterChain(
    ...components,
  ));
};

