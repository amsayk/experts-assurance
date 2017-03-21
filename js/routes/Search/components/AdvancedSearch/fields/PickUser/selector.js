import { createSelector } from 'utils/reselect';

const queryStringSelector = state => state.getIn(['cases', 'queryString']);

export default createSelector(
  queryStringSelector,
  (queryString) => ({ queryString })
);

