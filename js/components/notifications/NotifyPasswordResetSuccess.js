import React from 'react';

import style from './notifications.scss';

import messages from './messages';

import { injectIntl, intlShape } from 'react-intl';

function NotifyPasswordResetSuccess({ intl }) {
  return (
    <div className={style.notificationPasswordResetSuccess}>
      {intl.formatMessage(messages.PasswordResetSuccess)}
    </div>
  );
}

NotifyPasswordResetSuccess.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyPasswordResetSuccess);

