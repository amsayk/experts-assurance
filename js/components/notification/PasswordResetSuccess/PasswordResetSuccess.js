import React from 'react';

import style from '../Notification.scss';

import messages from '../messages';

import { injectIntl, intlShape } from 'react-intl';

import cx from 'classnames';

function PasswordResetSuccess({ intl, className }) {
  return (
    <div className={cx(className, style.notificationPasswordResetSuccess)}>
      {intl.formatMessage(messages.PasswordResetSuccess)}
    </div>
  );
}

PasswordResetSuccess.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(PasswordResetSuccess);

