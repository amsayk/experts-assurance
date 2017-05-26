import { createSelector } from 'utils/reselect';

const queryStringSelector = (_, { queryString }) => queryString;

export default createSelector(
  queryStringSelector,
  (queryString) => ({ queryString })
);

