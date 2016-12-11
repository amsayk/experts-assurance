import React, { PropTypes as T } from 'react';

import cx from 'classnames';

import style from './notifications.scss';

import messages from './messages';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

function NotifyVerificationPending({ intl, user, onResendPasswordVerification }) {
  const values = {
    email: <strong className={''}>{user.email}</strong>,
    resendPasswordVerificationLink: <a onClick={onResendPasswordVerification} className={cx(style.resendLink, 'alert-link')}>{intl.formatMessage(messages.ResendVerification)}</a>,
  };
  return (
    <div className={cx(style.notification, 'alert alert-warning fade active')}>
      <FormattedMessage
        {...messages.EmailVerificationPending}
        values={values}
      />
    </div>
  );
}

NotifyVerificationPending.propTypes = {
  intl                         : intlShape.isRequired,
  user                         : T.object.isRequired,
  onResendPasswordVerification : T.func.isRequired,
};

export default injectIntl(NotifyVerificationPending);

