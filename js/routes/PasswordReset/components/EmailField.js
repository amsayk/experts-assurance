import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import { injectIntl, intlShape } from 'react-intl';

function EmailField({ intl, placeholder, onKeyDown, input, meta: { touched, error } }) {
  return (
    <div className={cx('form-group', { 'has-danger': touched && error })}>
      <input
        {...input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoFocus
        autoComplete={'off'}
        type={'text'}
        className={cx('form-control', { 'form-control-danger': touched && error })}
      />
      <FormMessages errorCount={1} field={'email'}>
        <div className={'form-control-feedback hint-block'} when={'required'}>
          {intl.formatMessage(validationMessages.emailRequired)}
        </div>
        <div className={'form-control-feedback hint-block'} when={'email'}>
          {intl.formatMessage(validationMessages.emailInvalid)}
        </div>
        <div className={'form-control-feedback hint-block'} when={'promise'}>
          {intl.formatMessage(validationMessages.emailTaken)}
        </div>
      </FormMessages>
    </div>
  );
}

EmailField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(EmailField);

