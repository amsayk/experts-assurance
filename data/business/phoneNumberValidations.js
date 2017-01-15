import { generateValidation, addValidation } from 'validation';

import phoneUtil, { ValidationResult } from 'libphonenumber';

import config from 'build/config';

const log = require('log')('app:backend:business:phoneNumberValidation');

addValidation('phoneNumber', (field, value, prop) => {
  if (value && prop) {
    try {
      const potentialPhoneNumber = phoneUtil.parse(value, config.country);
      return !(
        phoneUtil.isPossibleNumberWithReason(potentialPhoneNumber) === ValidationResult.IS_POSSIBLE &&
        phoneUtil.isValidNumber(potentialPhoneNumber)
      );
    } catch (e) {
      log.error(e);
      return true;
    }
  }
  return false;
});

const validations = {
  phone: {
    phoneNumber: true,
  },
};

export default generateValidation(validations);

