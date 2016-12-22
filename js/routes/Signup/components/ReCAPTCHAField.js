import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import { injectIntl } from 'react-intl';

import ReCAPTCHA from 'components/ReCAPTCHA';

export default injectIntl(function ReCAPTCHAField({ intl, input, meta: { error } }) {
  return (
    <div className={cx('form-group', { 'has-danger': error })}>
      <ReCAPTCHA
        input={input}
      />
      <FormMessages field={'recaptcha'}>
        <div className={'form-control-feedback hint-block'} when={'equalTo'}>
          {intl.formatMessage(validationMessages.recaptchaRequired)}
        </div>
      </FormMessages>
    </div>
  );
});


