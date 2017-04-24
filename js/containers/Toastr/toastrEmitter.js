import { store } from 'redux/store';

import { mapToToastrMessage } from './utils';

import { showConfirm } from 'redux/reducers/toastr/actions';

const actions = {};

actions.confirm = (...args) => {
  store.dispatch(showConfirm({
    message: args[0],
    options: args[1] || {}
  }));
};

export const toastrEmitter = actions;

