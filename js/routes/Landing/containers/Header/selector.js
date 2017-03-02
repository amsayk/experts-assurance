import { createSelector } from 'utils/reselect';

import immutableStructure from 'redux-form/lib/structure/immutable';

const createIsActive = ({ getIn }) =>
  (getFormState = state => getIn(state, 'form')) =>
    state => {
      const formState = getFormState(state);
      return getIn(formState, `globalSearch.active`) === 'search';
    };

const appSelector = state => state.get('app');
const isActiveSelector = createIsActive(immutableStructure)();

export default createSelector(
  appSelector,
  isActiveSelector,
  (app, isActive) => ({ app, searching : isActive }),
);

