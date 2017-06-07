import { generateValidation } from 'validation';

const validations = {
  dateClosure : {
    required : true,
    validateOnBlur : true,
    date     : true,
  },
  paymentAmount: {
    // required       : true,
    number         : true,
    validateOnBlur : true,
  },

  paymentDate: {
    required       : true,
    date           : true,
    validateOnBlur : true,
  },

  // dateValidation: {
  //   required       : true,
  //   date           : true,
  //   validateOnBlur : true,
  // },
};

export default generateValidation(validations);

