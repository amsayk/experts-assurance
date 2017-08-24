import keyOf from 'keyOf';

export const ONGOING_IMPORTATION = keyOf({
  'importation/ONGOING_IMPORTATION': null,
});

export const BUSY = keyOf({ 'importation/BUSY': null });

export const SHOW = keyOf({ 'importation/SHOW': null });
export const HIDE = keyOf({ 'importation/HIDE': null });

export const RESTART = keyOf({ 'importation/RESTART': null });

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

export class ValidationStatus {
  static PENDING = 0;
  static IN_PROGRESS = 1;
  static SUCCESS = 2;
  static ERROR = 3;
}

export class UploadStatus {
  static PENDING = 10;
  static IN_PROGRESS = 11;
  static SUCCESS = 12;
  static ERROR = 13;
}

export const BEGIN_UPLOAD = keyOf({ 'importation/BEGIN_UPLOAD': null });
export const UPLOAD_ERROR = keyOf({ 'importation/UPLOAD_ERROR': null });
export const UPLOAD_SUCCESS = keyOf({ 'importation/UPLOAD_SUCCESS': null });

export const Stage_FILES = 1;
export const Stage_VALIDATION = 2;
export const Stage_UPLOAD = 3;

export const MIN_DURATION = (__DEV__ ? 1 : 5) * 1000; // 5 seconds

export const ACCEPT = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
].join(',');
