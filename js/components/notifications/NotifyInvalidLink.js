import React from 'react';

import { history } from 'redux/store';

import cx from 'classnames';

import style from './notifications.scss';

import messages from './messages';

import { injectIntl, intlShape } from 'react-intl';

const onClose = () => history.replace({ state: {} });

function NotifyInvalidLink({ intl }) {
  return (
    <div className={cx(style.notification, 'alert alert-danger alert-dismissible fade active')}>
      <button type='button' onClick={onClose} className='close' data-dismiss='alert' aria-label='Close'>
        <span aria-hidden='true'>&times;</span>
      </button>
      {intl.formatMessage(messages.InvalidLink)}
    </div>
  );
}

NotifyInvalidLink.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyInvalidLink);

