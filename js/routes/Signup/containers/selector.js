import { createSelector } from 'utils/reselect';

const isAuthenticatedSelector = state => !state.get('user').isEmpty();
const initialValuesSelector = () => ({
  recaptcha: false,
});

export default createSelector(
  isAuthenticatedSelector,
  initialValuesSelector,
  (isAuthenticated, initialValues) => ({ isAuthenticated, initialValues })
);

