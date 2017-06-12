import { generateValidation } from 'validation';

const validations = {
  dateClosure : {
    date     : true,
    required : true,
    validateOnBlur : true,
  },
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

  paymentDate: {
    date           : true,
    required       : true,
    validateOnBlur : true,
  },

  // dateValidation: {
  //   required       : true,
  //   date           : true,
  //   validateOnBlur : true,
  // },
};

export default generateValidation(validations);

