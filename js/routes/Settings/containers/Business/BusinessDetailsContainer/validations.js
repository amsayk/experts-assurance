import { generateValidation } from 'validation';

const validations = {
  displayName: {
    validateOnBlur : true,
    required       : true,
  },
  url: {
    validateOnBlur : true,
    webSite        : true,
  },
};

export default generateValidation(validations);

