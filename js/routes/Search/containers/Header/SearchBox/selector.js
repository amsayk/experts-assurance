import { createSelector } from 'utils/reselect';

const docSearchSelector = state => state.get('docSearch');

export default createSelector(
  docSearchSelector,
  (docSearch) => ({ search : docSearch }),
);

