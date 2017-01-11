import { PASSWORD_MIN_LENGTH } from 'vars';
import { generateValidation } from 'validation';
const Parse = require(process.env.PARSE_MODULE_PATH); // will be required on server side.

const validations = {
  email: {
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
    required       : true,
    minLength      : PASSWORD_MIN_LENGTH,
  },

  passwordConfirmation: {
    matchField     : 'password',
  },

  recaptcha: {
    required : true,
    equalTo  : true,
  },
};

export default generateValidation(validations);

