import validations from './validations';

import moment from 'moment';

import isEmpty from 'isEmpty';

import {
  ONGOING_IMPORTATION,
  BUSY,

  // uploads
  BEGIN_UPLOAD,
  UPLOAD_ERROR,
  UPLOAD_SUCCESS,

  // validation
  ValidationStatus,
  UploadStatus,

  // Actions
  START_VALIDATION,
  VALIDATION_ERROR,
  VALIDATION_SUCCESS,
  FINISH_VALIDATION,
  EXTRACTED_DOCS,
  EXTRACTION_SUCCESS,
  EXTRACTION_ERROR,
  XLSX_TO_DOCS,
  SHOW,
  HIDE,
  START_EXTRACTION,
  ADD_FILES,
  REMOVE_FILE,

  // stages
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

  progress: 0,

  clientId: null,
  clientKey: null,
  clientDisplayName: null,

  agentId: null,
  agentKey: null,
  agentDisplayName: null,

  company: null,

  date: null,
  dateMission: null,

  dateValidation: null,
  paymentDate: null,

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

  static fromGraphQL(doc) {
    return new Doc({
      id: doc.id,
      progress: doc.progress,

      clientId: doc.client ? doc.client.id : null,
      clientKey: null,
      clientDisplayName: null,

      agentId: doc.agent ? doc.agent.id : null,
      agentKey: null,
      agentDisplayName: null,

      company: doc.company,

      date: doc.date,
      dateMission: doc.dateMission,

      dateValidation:
        doc.validation && doc.validation.date
          ? +moment(doc.validation.date)
          : null,
      paymentDate:
        doc.payment && doc.payment.date ? +moment(doc.payment.date) : null,

      police: doc.police,
      nature: doc.nature,

      vehicleManufacturer: doc.vehicle ? doc.vehicle.manufacturer : null,
      vehicleModel: doc.vehicle ? doc.vehicle.model : null,
      vehiclePlateNumber: doc.vehicle ? doc.vehicle.plateNumber : null,
      vehicleSeries: doc.vehicle ? doc.vehicle.series : null,
      vehicleMileage: doc.vehicle ? doc.vehicle.mileage : null,
      vehicledMC: doc.vehicle ? doc.vehicle.DMC : null,
      vehicleEnergy: doc.vehicle ? doc.vehicle.energy : null,
      vehiclePower: doc.vehicle ? doc.vehicle.power : null,
    });
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

      dateMission: data['DT Mission']
        ? +moment(data['DT Mission'], 'DD/MM/YY')
        : null,
      date: data['DT Sinistre']
        ? +moment(data['DT Sinistre'], 'DD/MM/YY')
        : null,

      company,

      dateValidation: data['DT VALIDATION']
        ? +moment(data['DT VALIDATION'], 'DD/MM/YY')
        : null,
      paymentDate: data['PAIEMENT']
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
      clientDisplayName: data['Assuré OU Tiers'] || null,

      agentId: null,
      agentKey: 'userData',
      agentDisplayName: data['Assureur conseil'] || null,

      police: data['N° Sinistre ou N° Police'] || null,
      nature: data['Nature'] || null,
    };

    return new Doc(payload);
  }
}

export class ImportState extends Record({
  id: null,

  busy: false,

  visible: false,
  stage: null,

  files: OrderedSet.of(),

  progress: 0,
  total: 0,

  date: null,
  endDate: undefined,

  extractions: 0,
  extracting: false,
  extractionError: null,
  docs: Set.of(),

  validationStatus: ValidationStatus.PENDING,
  validations: Set.of(),
  validationErrors: Set.of(),

  uploadStatus: UploadStatus.PENDING,
  uploadError: null,

  // user id
  user: undefined,
}) {}

const initialState = new ImportState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ONGOING_IMPORTATION:
      return initialState.merge({
        // Importation
        id: action.payload.id,
        progress: action.payload.progress,
        total: action.payload.total,
        files: OrderedSet.of(...action.payload.files),
        docs: Set.of(...action.payload.docs.map(Doc.fromGraphQL)),

        // Stage
        stage: action.payload.id ? Stage_UPLOAD : state.stage,

        // dates
        date: action.payload.date,
        endDate: action.payload.endDate,

        // validations
        validationStatus: action.payload.id
          ? ValidationStatus.SUCCESS
          : state.validationStatus,

        // Upload
        uploadStatus:
          action.payload.id &&
          (action.payload.endDate ||
            action.payload.progress === action.payload.total)
            ? UploadStatus.SUCCESS
            : UploadStatus.IN_PROGRESS,
        uploadError: state.uploadError,

        // Keep open
        visible: state.visible,

        // user
        user: action.payload.user,
      });
    case BUSY:
      return state.merge({
        busy: action.busy,
      });
    case ADD_FILES:
      return state.update('files', files => files.union(action.files));
    case REMOVE_FILE:
      return state.update('files', files => files.delete(action.file));
    case SHOW:
      return state.merge({
        visible: true,
      });
    case HIDE:
      return state.uploadStatus !== UploadStatus.IN_PROGRESS
        ? initialState
        : state.merge({ visible: false });
    case START_EXTRACTION:
      return state.merge({
        visible: true,
        extracting: true,
        extractions: state.extractions + 1,
        files: state.files,
      });
    case EXTRACTION_SUCCESS:
      return initialState.merge({
        visible: true,
        files: state.files,
        extracting: false,
        extractions: state.extractions,
        stage: state.docs.isEmpty() ? state.stage : Stage_VALIDATION,
        docs: state.docs,
      });
    case EXTRACTION_ERROR:
      return initialState.merge({
        visible: true,
        files: state.files,
        extractions: state.extractions,
        extractionError: action.error,
      });
    case EXTRACTED_DOCS:
      return state.update('docs', docs => docs.union(action.docs));
    case START_VALIDATION:
      return initialState.merge({
        visible: true,
        extractions: state.extractions,
        files: state.files,
        stage: Stage_VALIDATION,
        docs: state.docs,
        validationStatus: ValidationStatus.IN_PROGRESS,
      });
    case VALIDATION_ERROR:
      return initialState.merge({
        visible: true,
        extractions: state.extractions,
        files: state.files,
        stage: Stage_VALIDATION,
        docs: state.docs,
        validationStatus: ValidationStatus.ERROR,
        validations: state.validations,
        validationErrors: state.validationErrors.add(action.doc.id),
      });
    case VALIDATION_SUCCESS:
      return initialState.merge({
        visible: true,
        extractions: state.extractions,
        files: state.files,
        stage: Stage_VALIDATION,
        docs: state.docs,
        validationStatus: ValidationStatus.IN_PROGRESS,
        validations: state.validations.add(action.doc.id),
      });
    case FINISH_VALIDATION:
      return initialState.merge({
        visible: true,
        extractions: state.extractions,
        files: state.files,
        docs: state.docs,
        stage: Stage_VALIDATION,
        validationStatus: state.validationErrors.isEmpty()
          ? ValidationStatus.SUCCESS
          : ValidationStatus.ERROR,
        validations: state.validations,
        validationErrors: state.validationErrors,
      });
    case BEGIN_UPLOAD:
      return state.validationErrors.isEmpty()
        ? state.merge({
            stage: Stage_UPLOAD,
            date: action.date,
            uploadStatus: UploadStatus.IN_PROGRESS,
          })
        : state;
    case UPLOAD_ERROR:
      return state.merge({
        uploadStatus: UploadStatus.ERROR,
        uploadError: action.error,
      });
    case UPLOAD_SUCCESS:
      return state.visible
        ? state.merge({
            uploadStatus: UploadStatus.SUCCESS,
          })
        : initialState;
    default:
      return state;
  }
}
