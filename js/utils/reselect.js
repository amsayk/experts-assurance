import { createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'lodash.isequal';

// create a "selector creator" that uses lodash.isEqual instead of ===
export const createSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);

