import { PASSWORD_MIN_LENGTH } from 'env';
import { generateValidation } from 'validation';

const validations = {
  new_password: {
    validateOnBlur : true,
    required       : true,
    minLength      : PASSWORD_MIN_LENGTH,
  },

  passwordConfirmation: {
    validateOnBlur : true,
    matchField     : 'new_password',
  },
};

export default generateValidation(validations);

