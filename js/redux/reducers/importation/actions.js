import delay from 'delay';

import {
  START_VALIDATION,
  VALIDATION_ERROR,
  VALIDATION_SUCCESS,
  FINISH_VALIDATION,
  EXTRACTED_DOCS,
  EXTRACTION_SUCCESS,
  EXTRACTION_ERROR,
  XLSX_TO_DOCS,
  DOCS_TO_XLSX,
  START_IMPORTING,
  FINISH_IMPORTING,
  START_EXTRACTION,
  ADD_FILES,
  REMOVE_FILE,
  MIN_DURATION,
  Stage_VALIDATION,
} from './constants';

import { Doc } from './reducer';

export function startImporting() {
  return {
    type: START_IMPORTING,
  };
}

export function finishImporting() {
  return {
    type: FINISH_IMPORTING,
  };
}

export function extractDocs() {
  return (dispatch, getState) => {
    const startTime = Date.now();

    dispatch({
      type: START_EXTRACTION,
    });

    function readFile(f) {
      return new Promise(function(resolve, reject) {
        const isBinary =
          typeof FileReader !== 'undefined' &&
          typeof FileReader.prototype !== 'undefined' &&
          typeof FileReader.prototype.readAsBinaryString !== 'undefined';

        const reader = new FileReader();

        reader.onload = function(e) {
          const data = e.target.result;
          resolve({ data: isBinary ? data : btoa(fixdata(data)), isBinary });
        };

        reader.onerror = function(e) {
          reject(e);
        };

        if (isBinary) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
      });

      function fixdata(data) {
        let o = '',
          l = 0,
          w = 10240;
        for (; l < data.byteLength / w; ++l)
          o += String.fromCharCode.apply(
            null,
            new Uint8Array(data.slice(l * w, l * w + w)),
          );
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
      }
    }

    const extractedDocs = docs => ({
      type: EXTRACTED_DOCS,
      docs: docs.map(Doc.fromWorkbook),
    });

    const extractionSuccess = () => ({
      type: EXTRACTION_SUCCESS,
    });

    const extractionError = error => ({
      type: EXTRACTION_ERROR,
      extractionError: error,
    });

    const xlsxToDocs = ({ data, isBinary }) => ({
      task: XLSX_TO_DOCS,
      data,
      isBinary,
    });

    const files = getState().getIn(['importation', 'files']);

    let job = Promise.resolve();

    files.forEach(file => {
      job = job.then(async function() {
        const { data, isBinary } = await readFile(file);
        const { response: docs, error } = await dispatch(
          xlsxToDocs({ data, isBinary }),
        );

        if (error) {
          error.file = file;
          dispatch(extractionError(e));
        } else {
          dispatch(extractedDocs(docs));
        }
      });
    });

    job.then(
      function() {
        const cb = () => dispatch(extractionSuccess());
        const duration = Date.now() - startTime;
        if (duration >= MIN_DURATION) {
          cb();
        } else {
          setTimeout(cb, MIN_DURATION - duration);
        }
      },
      e => dispatch(extractionError(e)),
    );
  };
}

export function addFiles(files) {
  return {
    type: ADD_FILES,
    files,
  };
}

export function removeFile(file) {
  return {
    type: REMOVE_FILE,
    file,
  };
}

export function validateDocs() {
  return (dispatch, getState) => {
    const startTime = Date.now();

    dispatch({
      type: START_VALIDATION,
    });

    const docs = getState().getIn(['importation', 'docs']);

    let validationJob = Promise.resolve();

    const isValidating = () =>
      getState().getIn(['importation', 'stage']) === Stage_VALIDATION;

    docs.forEach(doc => {
      validationJob = validationJob.then(() => {
        if (isValidating()) {
          dispatch({
            type: doc.isValid() ? VALIDATION_SUCCESS : VALIDATION_ERROR,
            doc,
          });
          return delay(__DEV__ ? 0 : 100);
        }
      });
    });

    if (isValidating()) {
      validationJob.then(() => {
        const cb = () =>
          dispatch({
            type: FINISH_VALIDATION,
          });

        const duration = Date.now() - startTime;
        if (duration >= MIN_DURATION) {
          cb();
        } else {
          setTimeout(cb, MIN_DURATION - duration);
        }
      });
    }
  };
}

export function uploadDocs() {
  return async (dispatch, getState) => {
    dispatch({
      type: START_UPLOAD,
    });

    const docs = getState().getIn(['importation', 'docs']);

    for (const doc of docs) {
    }

    dispatch({
      type: UPLOAD_SUCCESS,
    });
  };
}
