import React from 'react';
import T from 'prop-types';

import messages from '../messages';

import style from '../Notification.scss';

import { injectIntl, intlShape } from 'react-intl';

import cx from 'classnames';

function VerificationSuccess({ intl, className, onClose }) {
  return (
    <div className={cx(className, style.notificationVerificationSuccess)}>
      <button
        type='button'
        onClick={onClose}
        className={style.close}
        data-dismiss='alert'
        aria-label='Close'
      >
        <span aria-hidden='true'>&times;</span>
      </button>
      <span>
        {intl.formatMessage(messages.EmailVerificationSuccess)}
      </span>
    </div>
  );
}

VerificationSuccess.propTypes = {
  intl: intlShape.isRequired,
  onClose: T.func.isRequired,
};

export default injectIntl(VerificationSuccess);
