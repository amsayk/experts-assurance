import { createSelector } from 'utils/reselect';
import cookie from 'react-cookie';

const isAuthenticatedSelector = state => !state.get('user').isEmpty();
const redirectSelector = (state, props) => props.location.query.redirect || '/';
const notifySelector = (_, { location }) => location.state && location.state.notify;
const initialValuesSelector = () => ({
  email: cookie.load('app.login', /* doNotParse = */true),
});

export default createSelector(
  isAuthenticatedSelector,
  redirectSelector,
  initialValuesSelector,
  notifySelector,
  (isAuthenticated, redirect, initialValues, notify) => ({ isAuthenticated, redirect, initialValues, notify })
);

