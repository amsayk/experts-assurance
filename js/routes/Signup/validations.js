import { PASSWORD_MIN_LENGTH, ENABLE_RECAPTCHA } from 'vars';
import { generateValidation } from 'validation';
const Parse = require(process.env.PARSE_MODULE_PATH); // will be required on server side.

const validations = {
  email: {
    required  : true,
    email     : true,
    promise   : function (fieldName, fieldValue, { email }) {
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
    required  : true,
    minLength : PASSWORD_MIN_LENGTH,
  },

  recaptcha: {
    required : ENABLE_RECAPTCHA,
  },
};

export default generateValidation(validations);

