import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import messages from '../messages';

import style from '../Signup.scss';

import { injectIntl, intlShape } from 'react-intl';

function EmailField({ intl, placeholder, onKeyDown, input, meta: { touched, error } }) {
  return (
    <div className={cx(style.formGroup, { [style.formGroupHasDanger]: touched && error })}>
      <input
        {...input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoComplete={'off'}
        type={'text'}
        className={cx(style.control, { [style.formControlDanger]: touched && error })}
      />
      <FormMessages errorCount={1} field={input.name}>
        <div className={style.formControlFeedback} when={'required'}>
          {intl.formatMessage(validationMessages.emailRequired)}
        </div>
        <div className={style.formControlFeedback} when={'email'}>
          {intl.formatMessage(validationMessages.emailInvalid)}
        </div>
        <div className={style.formControlFeedback} when={'promise'}>
          {intl.formatMessage(validationMessages.emailTaken)}
        </div>
      </FormMessages>
      {error || <p className={style.note}>{intl.formatMessage(messages.emailNote)}</p>}
    </div>
  );
}

EmailField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(EmailField);

