import cookie from 'react-cookie';

import {
  TOGGLE,
  SET_DURATION,
  SET_CATEGORY,
  // TOGGLE_INCLUDE_CANCELED,
  // SET_ONLY_VALID_OPEN,

  // sort
  // SORT_PENDING,
  SORT_OPEN,
  SORT_UNPAID,
  SORT_INVALID,
  // SORT_CLOSED,
} from './constants';

import { USER_LOGGED_OUT, USER_LOGGED_IN } from 'redux/reducers/user/constants';

import { INIT } from 'vars';

// sort
import sortReducer, {
  initialState as sortInitialState,
} from 'redux/reducers/sorting/reducer';

import { Record } from 'immutable';

export class DashboardState extends Record({
  // pendingOpen           : true,
  // pendingDurationInDays : 60,
  // pendingSortConfig     : sortInitialState,

  _open                 : true,
  // onlyValidOpen         : false,
  durationInDays        : 30.417, // 2 months
  openSortConfig        : sortInitialState,

  // closedOpen            : true,
  // closedDurationInDays  : 7,
  // includeCanceled       : false,
  // closedSortConfig      : sortInitialState,

  unpaidOpen            : true,
  unpaidDurationInDays  : 7,
  unpaidSortConfig      : sortInitialState,

  invalidOpen            : true,
  invalidDurationInDays  : 7,
  invalidSortConfig      : sortInitialState,
  category               : null,
}) {

  get viewStatus() {
    return {
      // pending : this.pendingOpen,
      open    : this.open,
      closed  : this.closedOpen,
      unpaid  : this.unpaidOpen,
      invalid : this.invalidOpen,
    };
  }

  get durations() {
    return {
      // pending : this.pendingDurationInDays,
      open    : this.durationInDays,
      closed  : this.closedDurationInDays,
      unpaid  : this.unpaidDurationInDays,
      invalid : this.invalidDurationInDays,
    };
  }

  // get pending() {
  //   return {
  //     duration : this.pendingDurationInDays,
  //     visible : this.pendingOpen,
  //     sortConfig : {
  //       key: this.pendingSortConfig.key || 'date',
  //       direction: this.pendingSortConfig.direction,
  //     },
  //   };
  // }

  get open() {
    return {
      duration : this.durationInDays,
      // onlyValidOpen : this.onlyValidOpen,
      visible : this._open,
      sortConfig : {
        key: this.openSortConfig.key || 'date',
        direction: this.openSortConfig.direction,
      },
    };
  }

  // get closed() {
  //   return {
  //     duration : this.closedDurationInDays,
  //     visible : this.closedOpen,
  //     includeCanceled : this.includeCanceled,
  //     sortConfig : {
  //       key: this.closedSortConfig.key || 'closure_date',
  //       direction: this.closedSortConfig.direction,
  //     },
  //   };
  // }

  get unpaid() {
    return {
      duration   : this.unpaidDurationInDays,
      visible    : this.unpaidOpen,
      sortConfig : {
        key       : this.unpaidSortConfig.key || 'date',
        direction : this.unpaidSortConfig.direction,
      },
    };
  }

  get invalid() {
    return {
      category   : this.category,
      duration   : this.invalidDurationInDays,
      visible    : this.invalidOpen,
      sortConfig : {
        key       : this.invalidSortConfig.key || 'date',
        direction : this.invalidSortConfig.direction,
      },
    };
  }
}

const initialState = new DashboardState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
      // case SORT_PENDING: {
      //   return state.merge({
      //     pendingSortConfig: sortReducer(state.pendingSortConfig, action.payload),
      //   });
      // }
    case SORT_OPEN: {
      return state.merge({
        openSortConfig: sortReducer(state.openSortConfig, action.payload),
      });
    }
    case SORT_UNPAID: {
      return state.merge({
        unpaidSortConfig: sortReducer(state.unpaidSortConfig, action.payload),
      });
    }
    case SORT_INVALID: {
      return state.merge({
        invalidSortConfig: sortReducer(state.invalidSortConfig, action.payload),
      });
    }
      // case SORT_CLOSED: {
      //   return state.merge({
      //     closedSortConfig: sortReducer(state.closedSortConfig, action.payload),
      //   });
      // }
      // case SET_ONLY_VALID_OPEN: {
      //   return state.merge({
      //     onlyValidOpen: action.onlyValidOpen,
      //   });
      // }
    case TOGGLE: {
      switch (action.dashboard) {
          // case 'pending':
          //   return state.merge({
          //     pendingOpen : ! state.pendingOpen,
          //   });
        case 'open':
          return state.merge({
            _open : ! state._open,
          });
          // case 'closed':
          //   return state.merge({
          //     closedOpen : ! state.closedOpen,
          //   });
        case 'unpaid':
          return state.merge({
            unpaidOpen : ! state.unpaidOpen,
          });
        case 'invalid':
          return state.merge({
            invalidOpen : ! state.invalidOpen,
          });
        default:
          throw new Error(`Unknown dashboard : ${action.dashboard}`);
      }
    }
    case SET_DURATION: {
      switch (action.dashboard) {
          // case 'pending':
          //   return state.merge({
          //     pendingDurationInDays : action.duration,
          //   });
        case 'open':
          return state.merge({
            durationInDays : action.duration,
          });
          // case 'closed':
          //   return state.merge({
          //     closedDurationInDays : action.duration,
          //   });
        case 'unpaid':
          return state.merge({
            unpaidDurationInDays : action.duration,
          });
        case 'invalid':
          return state.merge({
            invalidDurationInDays : action.duration,
          });
        default:
          throw new Error(`Unknown dashboard : ${action.dashboard}`);
      }
    }
    case SET_CATEGORY: {
      switch (action.dashboard) {
        case 'invalid':
          return state.merge({
            category : action.category,
          });
        default:
          throw new Error(`Unknown dashboard : ${action.dashboard}`);
      }
    }
      // case TOGGLE_INCLUDE_CANCELED: {
      //   return state.merge({
      //     includeCanceled : ! state.includeCanceled,
      //   });
      // }
    case USER_LOGGED_IN:
    case INIT: {
      const durations = cookie.load('dashboard.durations', /* doNotParse = */false) || {};
      const viewStatus = cookie.load('dashboard.viewStatus', /* doNotParse = */false) || {};

      // const onlyValidOpen = cookie.load('dashboard.onlyValidOpen', #<{(| doNotParse = |)}>#false);
      const includeCanceled = cookie.load('dashboard.includeCanceled', /* doNotParse = */false);

      return state.merge({ // TODO: rehydrate from currentUser
        // sort configs
        // pendingSortConfig     : sortInitialState.merge(cookie.load('dashboard.pendingSortConfig', #<{(| doNotParse = |)}>#false) || {}),
        openSortConfig        : sortInitialState.merge(cookie.load('dashboard.openSortConfig', /* doNotParse = */false) || {}),
        // closedSortConfig      : sortInitialState.merge(cookie.load('dashboard.closedSortConfig', #<{(| doNotParse = |)}>#false) || {}),
        unpaidSortConfig      : sortInitialState.merge(cookie.load('dashboard.unpaidSortConfig', /* doNotParse = */false) || {}),
        invalidSortConfig     : sortInitialState.merge(cookie.load('dashboard.invalidSortConfig', /* doNotParse = */false) || {}),
        category              : cookie.load('dashboard.category', /* doNotParse = */false),

        // Durations
        // pendingDurationInDays : durations.pending || initialState.pendingDurationInDays,
        durationInDays        : durations.open    || initialState.durationInDays,
        // closedDurationInDays  : durations.closed  || initialState.closedDurationInDays,
        unpaidDurationInDays  : durations.unpaid  || initialState.unpaidDurationInDays,
        invalidDurationInDays : durations.invalid || initialState.invalidDurationInDays,

        // onlyValidOpen         : typeof onlyValidOpen !== 'undefined' ? onlyValidOpen : initialState.onlyValidOpen,
        // includeCanceled       : typeof includeCanceled !== 'undefined' ? includeCanceled : initialState.includeCanceled,

        // Toggled?
        // pendingOpen           : typeof viewStatus.pending !== 'undefined' ? viewStatus.pending : initialState.pendingOpen,
        _open                 : typeof viewStatus.open    !== 'undefined' ? viewStatus.open    : initialState.open,
        // closedOpen            : typeof viewStatus.closed  !== 'undefined' ? viewStatus.closed  : initialState.closedOpen,
        unpaidOpen            : typeof viewStatus.unpaid  !== 'undefined' ? viewStatus.unpaid  : initialState.unpaidOpen,
        invalidOpen           : typeof viewStatus.invalid !== 'undefined' ? viewStatus.invalid  : initialState.invalidOpen,
      });
    }
    case USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
}

