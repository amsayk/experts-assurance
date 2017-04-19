import {mapToToastrMessage} from './utils';
import EventEmitter from 'eventemitter3';
const emitter = new EventEmitter();

const actions = {};

actions.confirm = (...args) => {
  emitter.emit('toastr/confirm', {
    message: args[0],
    options: args[1] || {}
  });
};

export const EE = emitter;
export const toastrEmitter = actions;

