import Parse from 'parse/node';
import { generateValidation } from 'validation';

const validations = {
  email: {
    required : true,
    email    : true,
    promise  : function (fieldName, fieldValue, { email, user }, dispatch) {
      return new Promise((resolve, reject) => {
        if (!email) {
          return resolve();
        }
        new Parse.Query(Parse.User)
          .equalTo('email', email)
          .notEqualTo('objectId', user.id)
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
};

export default generateValidation(validations);

