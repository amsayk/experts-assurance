import {
  TOGGLE,
  SET_CATEGORY,
  SET_DURATION,
  // TOGGLE_INCLUDE_CANCELED,
  // SET_ONLY_VALID_OPEN,
} from './constants';

// Sorting
import { sort } from 'redux/reducers/sorting/actions';

export const sortOpen       = sort('openDashboard');
// export const sortClosed  = sort('closedDashboard');
export const sortUnpaid     = sort('unpaidDashboard');
export const sortInvalid    = sort('invalidDashboard');

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

export function setCategory(category) {
  return {
    type :  SET_CATEGORY,
    dashboard : 'invalid',
    category,
  };
}

// export function toggleIncludeCanceled() {
//   return {
//     type : TOGGLE_INCLUDE_CANCELED,
//   };
// }

// export function onOnlyValidOpenChange(onlyValidOpen) {
//   return {
//     type : SET_ONLY_VALID_OPEN,
//     onlyValidOpen,
//   };
// }

