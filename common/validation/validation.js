import { Map } from 'immutable';
import invariant from 'invariant';
import * as basicValidations from './basic-validations';
function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
const validationStore = {};

export function addValidation(key, fn) {
  validationStore[key] = fn;
}

export function addMultipleValidations(obj) {
  Object.keys(obj).forEach((key) => addValidation(key, obj[key]));
}

addMultipleValidations(basicValidations);


export function generateAsyncValidation(validationConfig) {
  return (values) => {
    invariant(Map.isMap(values), '`values` must be an immutable Map.');
    const promiseList = [Promise.resolve()];
    const errors = {};

    function addError(field, validatorName, message = true) {
      if (!errors[field]) {
        errors[field] = {};
      }
      errors[field][validatorName] = message;

    }

    Object.keys(validationConfig).map((fieldName) => {
      const validation = validationConfig[fieldName];
      if (typeof validation === 'object') {
        Object.keys(validation).map((validationType) => {
          if (typeof validationStore[validationType] != 'function') {
            return;
          }
          const hasError = validationStore[validationType](fieldName, values.get(fieldName), validation[validationType], values.toJS(), validation); // eslint-disable-line max-len
          if (isPromise(hasError)) {
            promiseList.push(new Promise((resolve, reject) => {
              hasError.then(resolve).catch((msg) => {
                addError(fieldName, validationType, msg);
                resolve();
              });
            }));

          } else if (hasError) {
            addError(fieldName, validationType, hasError);
          }
        });
      }
    });
    return Promise.all(promiseList).then(() => {
      if (Object.keys(errors).length) {
        return Promise.reject(errors);
      }
    });
  };
}

export function generateAsyncBlurFields(validationConfig) {
  return Object.keys(validationConfig).filter((fieldName) => {
    return typeof (validationConfig[fieldName]) === 'object' && validationConfig[fieldName].validateOnBlur;
  });
}

export function generateValidation(validationConfig) {
  return {
    asyncValidate: generateAsyncValidation(validationConfig),
    asyncBlurFields: generateAsyncBlurFields(validationConfig),
  };
}
