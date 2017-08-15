import { createSelector } from 'utils/reselect';

const importationSelector = state => state.get('importation');

export default createSelector(importationSelector, importation => ({
  visible: importation.visible,
  importing: importation.id && !importation.endDate,
  stage: importation.stage,
}));
