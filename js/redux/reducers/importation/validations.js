import { generateValidation, addValidation } from 'validation';

import { MATCH_REF } from 'vars';

import moment from 'moment';

import isEmpty from 'isEmpty';

addValidation('matchRef', (_, id, matchRef, { dateMission }) => {
  if (matchRef) {
    function ToDTMission(key) {
      if (isEmpty(key)) {
        return false;
      }

      return key.substring(0, 6);
    }

    const key = ToDTMission(id);

    return dateMission && key
      ? !(moment(dateMission).format('YYMMDD') === key)
      : false;
  }
  return false;
});

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
    matchRef: MATCH_REF,
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
