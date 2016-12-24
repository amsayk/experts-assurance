import React from 'react';

import { history } from 'redux/store';

import messages from './messages';

import style from './notifications.scss';

import { injectIntl, intlShape } from 'react-intl';

const onClose = () => history.replace({ state: {} });

function NotifyVerificationSuccess({ intl }) {
  return (
    <div className={style.notificationVerificationSuccess}>
      <button type='button' onClick={onClose} className={style.close} data-dismiss='alert' aria-label='Close'>
        <span aria-hidden='true'>&times;</span>
      </button>
      {intl.formatMessage(messages.EmailVerificationSuccess)}
    </div>
  );
}

NotifyVerificationSuccess.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyVerificationSuccess);

