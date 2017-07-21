import { createSelector } from 'utils/reselect';

const importationSelector = state => state.get('importation');

export default createSelector(
  importationSelector,
  (importation) => ({
    importing : importation.importing,
    stage     : importation.stage,
  }),
);

