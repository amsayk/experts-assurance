import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import { injectIntl, intlShape } from 'react-intl';

import style from '../Signup.scss';

import { PASSWORD_MIN_LENGTH } from 'vars';

function PasswordField({ intl, placeholder, onKeyDown, input, meta: { touched, error } }) {
  return (
    <div className={cx(style.formGroup, { [style.formGroupHasDanger]: touched && error })}>
      <input
        {...input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        type={'password'}
        className={cx(style.control, { [style.formControlDanger]: touched && error })}
      />
      <FormMessages errorCount={1} field={'password'}>
        <div className={style.formControlFeedback} when={'required'}>
          {intl.formatMessage(validationMessages.passwordRequired)}
        </div>
        <div className={style.formControlFeedback} when={'minLength'}>
          {intl.formatMessage(validationMessages.passwordMinLength, { minLength: PASSWORD_MIN_LENGTH })}
        </div>
      </FormMessages>
    </div>
  );
}

PasswordField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(PasswordField);

