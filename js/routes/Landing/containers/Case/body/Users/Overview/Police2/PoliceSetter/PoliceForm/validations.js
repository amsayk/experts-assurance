import { generateValidation } from 'validation';

const validations = {
  police: {
    required: true,
  },
};

export default generateValidation(validations);
