import { PASSWORD_MIN_LENGTH } from 'vars';
import { generateValidation } from 'validation';

const validations = {
  new_password: {
    validateOnBlur : true,
    required       : true,
    minLength      : PASSWORD_MIN_LENGTH,
  },

};

export default generateValidation(validations);

