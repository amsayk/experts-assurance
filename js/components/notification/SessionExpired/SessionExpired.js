import React from 'react';
import { compose } from 'redux';

import style from '../Notification.scss';

import messages from '../messages';

import { injectIntl, intlShape } from 'react-intl';

import cx from 'classnames';

class SessionExpired extends React.Component {
  render() {
    const { intl, className } = this.props;
    return (
      <div className={cx(className, style.notificationSessionExpired)}>
        {intl.formatMessage(messages.SessionExpired)}
      </div>
    );
  }
}

SessionExpired.propTypes = {
  intl : intlShape.isRequired,
};

export default compose(
  injectIntl,
)(SessionExpired);

