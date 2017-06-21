import { generateValidation } from 'validation';

const validations = {
  date: {
    required       : true,
    date           : true,
  },
};

export default generateValidation(validations);

