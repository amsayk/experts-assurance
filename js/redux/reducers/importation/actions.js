import delay from 'delay';

import getMoment from 'getMoment';

import {
  RESTART,

  // Actions
  ONGOING_IMPORTATION,
  BUSY,

  // uploads
  BEGIN_UPLOAD,
  UPLOAD_ERROR,
  UPLOAD_SUCCESS,

  // Actions
  START_VALIDATION,
  VALIDATION_ERROR,
  VALIDATION_SUCCESS,
  FINISH_VALIDATION,
  EXTRACTED_DOCS,
  EXTRACTION_SUCCESS,
  EXTRACTION_ERROR,
  XLSX_TO_DOCS,
  DOCS_TO_XLSX,
  SHOW,
  HIDE,
  START_EXTRACTION,
  ADD_FILES,
  REMOVE_FILE,
  MIN_DURATION,
  Stage_VALIDATION,
} from './constants';

import { Doc } from './reducer';

import pick from 'lodash.pick';

import ONGOING_IMPORTATION_QUERY from './ongoingImportation.query.graphql';
import GET_IMPORTATION_QUERY from './getImportation.query.graphql';

import IMPORTATION_MUTATION from './importation.mutation.graphql';

export function loadImportation(importation) {
  return {
    type: ONGOING_IMPORTATION,
    payload: {
      ...pick(importation, [
        'id',
        'docs',
        'date',
        'endDate',
        'files',
        'progress',
        'total',
        'error',
      ]),
      user: importation.user.id,
    },
  };
}

export function boot() {
  return (dispatch, getState, { client }) => {
    // dispatch([
    //   {
    //     type: BUSY,
    //     busy: true,
    //   },
    // ]);

    // get ongoing importation
    const obs = client.watchQuery({
      query: ONGOING_IMPORTATION_QUERY,
      fetchPolicy: 'network-only',
      variables: {},
    });

    let sub = obs.subscribe({
      next: function fn({ data: { ongoingImportation } }) {
        if (ongoingImportation) {
          // Don't listen for ongoing importation anymore
          try {
            sub.unsubscribe();
          } catch (e) {}

          dispatch([
            loadImportation(ongoingImportation),
            // {
            //   type: BUSY,
            //   busy: false,
            // },
          ]);

          const importationQuery = client.watchQuery({
            query: GET_IMPORTATION_QUERY,
            fetchPolicy: 'network-only',
            variables: { id: ongoingImportation.id },
          });

          importationQuery._sub = importationQuery.subscribe({
            async next({ data: { getImportation: importation }, stale }) {
              if (
                importation.endDate ||
                importation.progress === importation.docs.length
              ) {
                try {
                  importationQuery._sub.unsubscribe();
                } catch (e) {}

                await obs.refetch();
                sub = obs.subscribe({ next: fn });
              }

              importation.progress && dispatch(loadImportation(importation));
            },
          });
        }
      },
      error() {},
    });
  };
}

export function show() {
  return {
    type: SHOW,
  };
}

export function backToStart() {
  return {
    type: RESTART,
  };
}

export function hide() {
  return {
    type: HIDE,
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
      validationJob = validationJob.then(async () => {
        if (isValidating()) {
          await delay(__DEV__ ? 0 : 50);
          dispatch({
            type: doc.isValid() ? VALIDATION_SUCCESS : VALIDATION_ERROR,
            doc,
          });
        }
      });
    });

    if (isValidating()) {
      validationJob.then(() => {
        dispatch({
          type: FINISH_VALIDATION,
        });
      });
    }
  };
}

export function uploadDocs() {
  return async (dispatch, getState, { client, snackbar }) => {
    const moment = getMoment(
      getState().getIn(['intl']).localeWithFallback,
      moment => moment.utc,
    );

    dispatch({
      type: BEGIN_UPLOAD,
      date: +moment(),
    });

    const getDocs = () => getState().getIn(['importation', 'docs']).toArray();

    // 1. refresh ongoing importation
    // Update will happen in boot
    await client.query({
      query: ONGOING_IMPORTATION_QUERY,
      fetchPolicy: 'network-only',
      variables: {},
    });

    const id = getState().getIn(['importation', 'id']);

    if (id) {
      return;
    }

    try {
      // 2. Importation

      const importation = await doImportation();

      if (!getState().getIn(['importation', 'visible'])) {
        snackbar.show({
          message: 'Importation avec succès',
          persist: true,
          action: {
            title: 'FERMER',
            // Must not be an arrow function
            click: function() {
              this.dismiss();
            },
          },
        });
      }

      // One last refresh just in case.
      client.query({
        query: GET_IMPORTATION_QUERY,
        fetchPolicy: 'network-only',
        variables: { id: importation.id },
      });

      // 3. finish importation
      dispatch({
        type: UPLOAD_SUCCESS,
      });
    } catch (e) {
      dispatch({
        type: UPLOAD_ERROR,
        error: e,
      });

      if (!getState().getIn(['importation', 'visible'])) {
        snackbar.show({
          type: 'error',
          message: `Erreur d'importation`,
          persist: true,
          action: {
            title: 'FERMER',
            // Must not be an arrow function
            click: function() {
              this.dismiss();
            },
          },
        });
      }
    }

    async function doImportation() {
      const info = {
        date: getState().getIn(['importation', 'date']),
        docs: getDocs().map((doc, index) => ({
          progress: index + 1,
          ...pick(doc, [
            'id',
            'clientId',
            'clientKey',
            'clientDisplayName',
            'agentId',
            'agentKey',
            'agentDisplayName',
            'company',
            'date',
            'dateMission',
            'dateValidation',
            'paymentDate',
            'police',
            'nature',
            'vehicleManufacturer',
            'vehicleModel',
            'vehiclePlateNumber',
            'vehicleSeries',
            'vehicleMileage',
            'vehicledMC',
            'vehicleEnergy',
            'vehiclePower',
          ]),
        })),
        files: getState().getIn(['importation', 'files']).toJS(),
      };

      const {
        data: { Importation: { error, importation } },
      } = await client.mutate({
        mutation: IMPORTATION_MUTATION,
        variables: { info },
      });

      if (error) {
        throw error;
      } else {
        return importation;
      }
    }
  };
}
