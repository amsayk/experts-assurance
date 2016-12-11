import React from 'react';

import cx from 'classnames';

import style from './notifications.scss';

import messages from './messages';

import { injectIntl, intlShape } from 'react-intl';

function NotifyPasswordResetSuccess({ intl }) {
  return (
    <div className={cx(style.notification, 'alert alert-success fade active')}>
      {intl.formatMessage(messages.PasswordResetSuccess)}
    </div>
  );
}

NotifyPasswordResetSuccess.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyPasswordResetSuccess);

