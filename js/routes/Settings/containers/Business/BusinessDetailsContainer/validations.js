import { generateValidation } from 'validation';

import { COUNTRY } from 'vars';

const validations = {
  displayName: {
    validateOnBlur : true,
    required       : true,
  },
  url: {
    validateOnBlur : true,
    webSite        : true,
  },
  country: {
    validateOnBlur : true,
    country        : COUNTRY,
    required       : true,
  },
  postalCode: {
    validateOnBlur : true,
    zipCode        : COUNTRY,
  },
};

export default generateValidation(validations);

