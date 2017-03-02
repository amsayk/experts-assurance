import { createSelector } from 'utils/reselect';

const queryStringSelector = state => state.getIn(['users', 'queryString']);

export default createSelector(
  queryStringSelector,
  (queryString) => ({ queryString }),
);

