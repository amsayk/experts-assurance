import { createSelector } from 'utils/reselect';
import cookie from 'react-cookie';

const redirectSelector = (_, props) => props.location.query.redirect || '/';
const initialValuesSelector = () => ({
  email: __DEV__ ? cookie.load('app.logIn', /* doNotParse = */true) : null,
});

export default createSelector(
  redirectSelector,
  initialValuesSelector,
  (redirect, initialValues) => ({ redirect, initialValues })
);

