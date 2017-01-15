import { createSelector } from 'utils/reselect';

const initialValuesSelector = () => ({
  recaptcha: false,
});

export default createSelector(
  initialValuesSelector,
  (initialValues) => ({ initialValues })
);

