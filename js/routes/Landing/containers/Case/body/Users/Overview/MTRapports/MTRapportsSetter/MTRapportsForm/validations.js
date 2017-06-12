import { generateValidation } from 'validation';

const validations = {
  amount: {
    required       : true,
    number         : true,
    validateOnBlur : true,
  },
};

export default generateValidation(validations);

