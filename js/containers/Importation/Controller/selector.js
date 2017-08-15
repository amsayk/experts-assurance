import { createSelector } from 'utils/reselect';

const importationSelector = state => state.get('importation');

export default createSelector(importationSelector, importation => ({
  visible: importation.visible,
  stage: importation.stage,
  id: importation.id,
}));
