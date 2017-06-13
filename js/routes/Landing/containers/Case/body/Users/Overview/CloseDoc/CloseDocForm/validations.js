import { generateValidation } from 'validation';

import { SERVER } from 'vars';

const paymentDate = {
  required : true,
  validateOnBlur : true,

}

if (SERVER) {
  paymentDate.date = true;
}

const dateClosure = {
  required : true,
  validateOnBlur : true,

}

if (SERVER) {
  dateClosure.date = true;
}

const validations = {
  dateClosure,
  mtRapports: {
    number         : true,
    required       : true,
    validateOnBlur : true,
  },

  paymentAmount: {
    // required       : true,
    number         : true,
    validateOnBlur : true,
  },

  paymentDate,

  // dateValidation: {
  //   required       : true,
  //   date           : true,
  //   validateOnBlur : true,
  // },
};

export default generateValidation(validations);

