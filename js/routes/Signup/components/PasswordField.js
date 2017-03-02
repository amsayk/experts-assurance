import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import { injectIntl, intlShape } from 'react-intl';

import style from '../Signup.scss';

import { PASSWORD_MIN_LENGTH } from 'vars';

import PasswordInput from 'components/PasswordInput';

function PasswordField({ intl, placeholder, onKeyDown, input, meta: { touched, error } }) {
  return (
    <div className={cx(style.formGroup, { [style.formGroupHasDanger]: touched && error })}>
      <PasswordInput
        inputProps={input}
        inputClassName={cx(style.control, { [style.formControlDanger]: touched && error })}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
      />
      <FormMessages errorCount={1} field={input.name}>
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

