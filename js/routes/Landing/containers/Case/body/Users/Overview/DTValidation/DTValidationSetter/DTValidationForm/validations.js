import { generateValidation } from 'validation';

const validations = {
  date: {
    required       : true,
    date           : true,
    validateOnBlur : true,
  },
};

export default generateValidation(validations);

