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

const mtRapports = {
  validateOnBlur : true,
  required       : true,
  number         : true,
};

if (SERVER) {
  mtRapports.required = process.env._IMPORTING !== 'yes';
  mtRapports.number = process.env._IMPORTING !== 'yes';
}

const validations = {
  dateClosure,
  mtRapports,

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

