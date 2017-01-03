import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import style from './notifications.scss';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_CHANGE_EMAIL } from 'vars';

import messages from './messages';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

function NotifyVerificationPending({ intl, user, onResendEmailVerification }) {
  const values = {
    email: <strong className={''}>{user.email}</strong>,
    resendEmailVerificationLink: (
      <a onClick={onResendEmailVerification} className={style.resendLink}>
        {intl.formatMessage(messages.ResendVerification)}
      </a>
    ),
    changeEmail: (
      <Link className={style.changeEmailLink} to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_EMAIL}>
        {intl.formatMessage(messages.ChangeEmail)}
      </Link>
    ),
  };
  return (
    <div className={style.notificationVerificationPending}>
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
  onResendEmailVerification    : T.func.isRequired,
};

export default injectIntl(NotifyVerificationPending);

