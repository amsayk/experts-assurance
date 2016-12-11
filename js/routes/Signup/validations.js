import { PASSWORD_MIN_LENGTH } from 'env';
import { generateValidation } from 'validation';
const Parse = require(process.env.PARSE_MODULE_PATH); // will be required on server side.

const validations = {
  email: {
    validateOnBlur : true,
    required       : true,
    email          : true,
    promise        : function (fieldName, fieldValue, { email }, dispatch) {
      return new Promise((resolve, reject) => {
        if (!email) {
          return resolve();
        }
        new Parse.Query(Parse.User)
          .equalTo('email', email)
          .first()
          .then(
            function (object) {
              if (object) {
                reject(true);
                return;
              }

              resolve();
            },

            function () {
              reject(true);
            }
          );
      });
    },
  },

  password: {
    validateOnBlur : true,
    required       : true,
    minLength      : PASSWORD_MIN_LENGTH,
  },

  passwordConfirmation: {
    validateOnBlur : true,
    matchField     : 'password',
  },

  recaptcha: {
    required : true,
    equalTo  : true,
  },
};

export default generateValidation(validations);

