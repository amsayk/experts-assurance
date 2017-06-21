import { generateValidation } from 'validation';

const validations = {
  amount: {
    // required       : true,
    number         : true,
    validateOnBlur : true,
  },

  date: {
    required       : true,
    date           : true,
  },
};

export default generateValidation(validations);

