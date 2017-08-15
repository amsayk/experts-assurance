import { generateValidation } from 'validation';

import { SERVER } from 'vars';

export default function getValidations(importing = false) {
  const paymentDate = {
    required: true,
    validateOnBlur: true,
  };

  if (SERVER) {
    paymentDate.date = true;
  }

  const dateClosure = {
    required: true,
    validateOnBlur: true,
  };

  if (SERVER) {
    dateClosure.date = true;
  }

  const mtRapports = {
    validateOnBlur: true,
    required: true,
    number: true,
  };

  if (SERVER) {
    mtRapports.required = !importing;
    mtRapports.number = !importing;
  }

  const validations = {
    dateClosure,
    mtRapports,

    paymentAmount: {
      // required       : true,
      number: true,
      validateOnBlur: true,
    },

    paymentDate,

    // dateValidation: {
    //   required       : true,
    //   date           : true,
    //   validateOnBlur : true,
    // },
  };

  return generateValidation(validations);
}
