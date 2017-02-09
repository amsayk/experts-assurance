import { createSelector } from 'utils/reselect';

const selectionSelector = (state) => state.getIn(['catalog', 'selection', 'keys']);

export default createSelector(
  selectionSelector,
  (selection) => ({ hasSelection: !selection.isEmpty() }),
);

