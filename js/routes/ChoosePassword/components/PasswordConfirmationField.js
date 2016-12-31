import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import style from '../ChoosePassword.scss';

import { injectIntl, intlShape } from 'react-intl';

function PasswordConfirmationField({ intl, placeholder, onKeyDown, input, meta: { touched, error } }) {
  return (
    <div className={cx(style.formGroup, { [style.formGroupHasDanger]: touched && error })}>
      <input
        {...input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        type={'password'}
        className={cx(style.control, { [style.formControlDanger]: touched && error })}
      />
      <FormMessages field={input.name}>
        <div className={style.formControlFeedback} when={'matchField'}>
          {intl.formatMessage(validationMessages.passwordMismatch)}
        </div>
      </FormMessages>
    </div>
  );
}

PasswordConfirmationField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(PasswordConfirmationField);

