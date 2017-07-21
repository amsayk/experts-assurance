import {
  START_IMPORTING,
  FINISH_IMPORTING,

  STAGE,
} from './constants';

export function setState(stage) {
  return {
    type : STAGE,
    stage,
  };
}

export function startImporting() {
  return {
    type : START_IMPORTING,
  }
}

export function finishImporting() {
  return {
    type : FINISH_IMPORTING,
  }
}

