import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import { injectIntl, intlShape } from 'react-intl';

import { PASSWORD_MIN_LENGTH } from 'vars';

function PasswordField({ intl, placeholder, onKeyDown, input, meta: { touched, error } }) {
  return (
    <div className={cx('form-group', { 'has-danger': touched && error })}>
      <input
        {...input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        type={'password'}
        className={cx('form-control', { 'form-control-danger': touched && error })}
      />
      <FormMessages errorCount={1} field={'password'}>
        <div className={'form-control-feedback'} when={'required'}>
          {intl.formatMessage(validationMessages.passwordRequired)}
        </div>
        <div className={'form-control-feedback'} when={'minLength'}>
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

