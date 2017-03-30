import {
  TOGGLE,
  SET_DURATION,
  TOGGLE_INCLUDE_CANCELED,
  SET_ONLY_VALID_OPEN,
} from './constants';

// Sorting
import { sort } from 'redux/reducers/sorting/actions';

export const sortPending            = sort('pendingDashboard');
export const sortOpen            = sort('openDashboard');
export const sortClosed            = sort('closedDashboard');

export function toggle(dashboard) {
  return {
    type : TOGGLE,
    dashboard,
  };
}

export function setDuration(dashboard, duration) {
  return {
    type : SET_DURATION,
    dashboard,
    duration,
  };
}

export function toggleIncludeCanceled() {
  return {
    type : TOGGLE_INCLUDE_CANCELED,
  };
}

export function onOnlyValidOpenChange(onlyValidOpen) {
  return {
    type : SET_ONLY_VALID_OPEN,
    onlyValidOpen,
  };
}
