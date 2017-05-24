import {
  getFormAsyncErrors,
  getFormSubmitErrors,
} from 'redux-form/immutable';

import { createSelector } from 'utils/reselect';

const errorSelector = (fieldName) => state => {
  const asyncErrors = getFormAsyncErrors('closeDoc')(state);
  const submitErrors = getFormSubmitErrors('closeDoc')(state);

  const fieldAsyncError = asyncErrors
    ? asyncErrors.get(fieldName, null)
    : null;
  const fieldSubmitError = submitErrors
    ? submitErrors.get(fieldName, null)
    : null;

  return fieldSubmitError || fieldAsyncError;
};

export default (fieldName) => createSelector(
  errorSelector(fieldName),
  (error) => ({ [fieldName] : error }),
);

