import React, { PropTypes as T } from 'react';

import style from '../Notification.scss';

import messages from '../messages';

import { injectIntl, intlShape } from 'react-intl';

import cx from 'classnames';

function InvalidLink({ intl, className, onClose }) {
  return (
    <div className={cx(className, style.notificationInvalidLink)}>
      <button type='button' onClick={onClose} className={style.close} data-dismiss='alert' aria-label='Close'>
        <span aria-hidden='true'>&times;</span>
      </button>
      {intl.formatMessage(messages.InvalidLink)}
    </div>
  );
}

InvalidLink.propTypes = {
  intl    : intlShape.isRequired,
  onClose : T.func.isRequired,
};

export default injectIntl(InvalidLink);

