import { generateValidation } from 'validation';

const dateMission = {
  required: true,
};

dateMission.date = true;

const date = {
  required: true,
};

date.date = true;

const dateValidation = {};

dateValidation.date = true;

const datePayment = {};

datePayment.date = true;

const validations = {
  id: {
    required: true,
  },

  dateMission,

  date,

  dateValidation,
  datePayment,

  vehicleManufacturer: {
    required: true,
  },

  vehicleModel: {},

  vehiclePlateNumber: {
    required: true,
  },

  company: {
    required: true,
  },

  clientDisplayName: {
    required: true,
  },
  clientEmail: {
    email: true,
  },

  agentDisplayName: {
    required: true,
  },
  agentEmail: {
    email: true,
  },
};

export default generateValidation(validations);
