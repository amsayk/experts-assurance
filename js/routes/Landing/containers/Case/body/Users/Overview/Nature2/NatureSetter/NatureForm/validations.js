import { generateValidation } from 'validation';

const validations = {
  nature: {
    required: true,
  },
};

export default generateValidation(validations);
