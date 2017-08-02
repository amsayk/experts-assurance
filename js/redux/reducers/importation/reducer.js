import validations from './validations';

import moment from 'moment';

import isEmpty from 'isEmpty';

import {
  START_VALIDATION,
  VALIDATION_ERROR,
  VALIDATION_SUCCESS,
  FINISH_VALIDATION,
  EXTRACTED_DOCS,
  EXTRACTION_SUCCESS,
  EXTRACTION_ERROR,
  XLSX_TO_DOCS,
  START_IMPORTING,
  FINISH_IMPORTING,
  START_EXTRACTION,
  ADD_FILES,
  REMOVE_FILE,
  Stage_VALIDATION,
  Stage_UPLOAD,
} from './constants';

import { SERVER } from 'vars';

import { Record, OrderedSet, Set, List } from 'immutable';

if (!SERVER) {
  File.prototype.equals = function(other) {
    return other.name === this.name;
  };
}

export class Doc extends Record({
  id: null,

  clientId: null,
  clientKey: null,
  clientDisplayName: null,
  clientEmail: null,

  agentId: null,
  agentKey: null,
  agentDisplayName: null,
  agentEmail: null,

  company: null,

  date: null,
  dateMission: null,

  dateValidation: null,
  datePayment: null,

  police: null,
  nature: null,

  vehicleManufacturer: null,
  vehicleModel: null,
  vehiclePlateNumber: null,
  vehicleSeries: null,
  vehicleMileage: null,
  vehicledMC: null,
  vehicleEnergy: null,
  vehiclePower: null,
}) {
  isValid() {
    if (!this._validationResult) {
      this._validationResult = validations.validate(this);
    }

    return this._validationResult;
  }

  equals(other) {
    return this.id === other.id;
  }

  static fromWorkbook(data) {
    function getRef(doc) {
      const key = doc['Réf'];

      if (isEmpty(key)) {
        return { company: null, ref: null };
      }

      const company = key.substring(0, 3);
      const ref = key.substring(3);

      return { company, ref };
    }

    const { ref, company } = getRef(data);

    const payload = {
      id: ref,

      dateMission: +moment(data['DT Mission'], 'DD/MM/YY'),
      date: +moment(data['DT Sinistre'], 'DD/MM/YY'),

      company,

      dateValidation: data['DT VALIDATION']
        ? +moment(data['DT VALIDATION'], 'DD/MM/YY')
        : null,
      datePayment: data['PAIEMENT']
        ? +moment(data['PAIEMENT'], 'DD/MM/YY')
        : null,

      vehicleManufacturer: data['Véhicule'] || null,
      vehicleModel: data['Genre'] || null,
      vehiclePlateNumber: data['N° Immat'] || null,
      vehicleSeries: data['N° Série'] || null,
      vehicleMileage: null,
      vehicleDMC: null,
      vehicleEnergy: null,
      vehiclePower: null,

      clientId: null,
      clientKey: 'userData',
      clientDisplayName: data['Assuré OU Tiers'],
      clientEmail: null,

      agentId: null,
      agentKey: 'userData',
      agentDisplayName: data['Assureur conseil'],
      agentEmail: null,

      police: data['N° Sinistre ou N° Police'] || null,
      nature: data['Nature'] || null,
    };

    return new Doc(payload);
  }
}

export class ImportState extends Record({
  importing: false,
  stage: null,

  files: OrderedSet.of(),

  extractions: 0,
  extracting: false,
  extractionError: null,
  docs: OrderedSet.of(),

  validating: false,
  validations: Set.of(),
  validationErrors: Set.of(),

  uploading: false,
  uploadError: null,
}) {}

const initialState = new ImportState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_FILES:
      return state.update('files', files => files.union(action.files));
    case REMOVE_FILE:
      return state.update('files', files => files.delete(action.file));
    case START_IMPORTING:
      return initialState.merge({
        importing: true,
      });
    case FINISH_IMPORTING:
      return initialState;
    case START_EXTRACTION:
      return state.merge({
        importing: true,
        extracting: true,
        extractions: state.extractions + 1,
        files: state.files,
      });
    case EXTRACTION_SUCCESS:
      return initialState.merge({
        importing: true,
        files: state.files,
        extracting: false,
        extractions: state.extractions,
        stage: state.docs.isEmpty() ? state.stage : Stage_VALIDATION,
        docs: state.docs,
      });
    case EXTRACTION_ERROR:
      return initialState.merge({
        importing: true,
        files: state.files,
        extractions: state.extractions,
        extractionError: action.error,
      });
    case EXTRACTED_DOCS:
      return state.update('docs', docs => docs.union(action.docs));
    case START_VALIDATION:
      return initialState.merge({
        importing: true,
        extractions: state.extractions,
        files: state.files,
        stage: Stage_VALIDATION,
        docs: state.docs,
        validating: true,
      });
    case VALIDATION_ERROR:
      return initialState.merge({
        importing: true,
        extractions: state.extractions,
        files: state.files,
        stage: Stage_VALIDATION,
        docs: state.docs,
        validating: true,
        validations: state.validations,
        validationErrors: state.validationErrors.add(action.doc.id),
      });
    case VALIDATION_SUCCESS:
      return initialState.merge({
        importing: true,
        extractions: state.extractions,
        files: state.files,
        stage: Stage_VALIDATION,
        docs: state.docs,
        validating: true,
        validations: state.validations.add(action.doc.id),
      });
    case FINISH_VALIDATION:
      return initialState.merge({
        importing: true,
        extractions: state.extractions,
        files: state.files,
        stage: state.validationErrors.isEmpty()
          ? Stage_UPLOAD
          : Stage_VALIDATION,
        docs: state.docs,
        validating: false,
        validations: state.validations,
        validationErrors: state.validationErrors,
      });
    default:
      return state;
  }
}
