import keyOf from 'keyOf';

export const START_IMPORTING = keyOf({ 'importation/START_IMPORTING': null });
export const FINISH_IMPORTING = keyOf({ 'importation/FINISH_IMPORTING': null });

export const START_EXTRACTION = keyOf({ 'importation/START_EXTRACTION': null });
export const ADD_FILES = keyOf({ 'importation/ADD_FILES': null });
export const REMOVE_FILE = keyOf({ 'importation/REMOVE_FILE': null });

export const EXTRACTION_SUCCESS = keyOf({
  'importation/EXTRACTION_SUCCESS': null,
});
export const EXTRACTION_ERROR = keyOf({ 'importation/EXTRACTION_ERROR': null });
export const EXTRACTED_DOCS = keyOf({ 'importation/EXTRACTED_DOCS': null });
export const XLSX_TO_DOCS = keyOf({ 'importation/XLSX_TO_DOCS': null });

export const START_VALIDATION = keyOf({ 'importation/START_VALIDATION': null });
export const VALIDATION_ERROR = keyOf({ 'importation/VALIDATION_ERROR': null });
export const VALIDATION_SUCCESS = keyOf({
  'importation/VALIDATION_SUCCESS': null,
});
export const FINISH_VALIDATION = keyOf({
  'importation/FINISH_VALIDATION': null,
});

export const Stage_FILES = keyOf({ 'importation/Stage_FILES': null });
export const Stage_VALIDATION = keyOf({ 'importation/Stage_VALIDATION': null });
export const Stage_UPLOAD = keyOf({ 'importation/Stage_UPLOAD': null });

export const MIN_DURATION = (__DEV__ ? 1 : 5) * 1000; // 5 seconds

export const ACCEPT = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
].join(',');
