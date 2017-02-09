import { generateValidation, addValidation } from 'validation';
const Parse = require(process.env.PARSE_MODULE_PATH); // will be required on server side.

import isEmpty from 'isEmpty';

import { ProductType } from 'data/types';

addValidation('productName', async (field, value, prop) => {
  if (value && prop) {
    const product =  await new Parse.Query(ProductType)
      .equalTo(field, value)
      .first();

    if (!isEmpty(product)) {
      throw undefined;
    }
  }
  return false;
});

const validations = {
  displayName: {
    required       : true,
    productName    : true,
    validateOnBlur : true,
  },

};

export default generateValidation(validations);

