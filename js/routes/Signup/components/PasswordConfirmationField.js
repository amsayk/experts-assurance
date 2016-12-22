import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import { injectIntl, intlShape } from 'react-intl';

function PasswordConfirmationField({ intl, placeholder, onKeyDown, input, meta: { touched, error } }) {
  return (
    <div className={cx('form-group', { 'has-danger': touched && error })}>
      <input
        {...input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        type={'password'}
        className={cx('form-control', { 'form-control-danger': touched && error })}
      />
      <FormMessages field={'passwordConfirmation'}>
        <div className={'form-control-feedback hint-block'} when={'matchField'}>
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

