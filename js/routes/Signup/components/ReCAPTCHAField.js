import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import { injectIntl } from 'react-intl';

import style from '../Signup.scss';

import ReCAPTCHA from 'components/ReCAPTCHA';

export default injectIntl(function ReCAPTCHAField({ intl, input, meta: { error } }) {
  return (
    <div className={cx(style.formGroup, { [style.formGroupHasDanger]: error })}>
      <ReCAPTCHA
        input={input}
      />
      <FormMessages field={input.name}>
        <div className={style.formControlFeedback} when={'equalTo'}>
          {intl.formatMessage(validationMessages.recaptchaRequired)}
        </div>
      </FormMessages>
    </div>
  );
});

