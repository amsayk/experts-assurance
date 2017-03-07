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
const scrollingSelector = (state) => state.get('scrolling');
const notificationOpenSelector = (state) => state.getIn(['notification', 'options', 'active']);

export default createSelector(
  appSelector,
  isActiveSelector,
  scrollingSelector,
  notificationOpenSelector,
  (app, isActive, scrolling, notificationOpen) => ({ app, searching : isActive, scrolling, notificationOpen }),
);

