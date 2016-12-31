import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import {
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_ACCOUNT,
  PATH_SETTINGS_CHANGE_PASSWORD,
  PATH_SETTINGS_BUSINESS_DETAILS,
} from 'vars';

import { intlShape, injectIntl } from 'react-intl';

import messages from '../messages';

import cx from 'classnames';

import style from '../Settings.scss';

export function Sidebar({ intl, selectedMenuItem }) {
  return (
    <div className={style.sidebar}>

      {/* General section */}
      <h1 className={style.heading}>{intl.formatMessage(messages.headingGeneral)}</h1>
      <ul>
        <li className={cx({ [style.selected]: selectedMenuItem === 'account.settings' })}>
          <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_ACCOUNT}>
            {intl.formatMessage(messages.linkAccountSettings)}
          </Link>
        </li>
      </ul>

      <hr/>

      {/* Security section */}
      <h1 className={style.heading}>{intl.formatMessage(messages.headingSecurity)}</h1>
      <ul>
        <li className={cx({ [style.selected]: selectedMenuItem === 'security.change_password' })}>
          <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_PASSWORD}>
            {intl.formatMessage(messages.linkChangePassword)}
          </Link>
        </li>
      </ul>

      <hr/>

      {/* Business settings */}
      <h1 className={style.heading}>{intl.formatMessage(messages.headingBusiness)}</h1>
      <ul>
        <li className={cx({ [style.selected]: selectedMenuItem === 'business.settings' })}>
          <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_DETAILS}>
            {intl.formatMessage(messages.linkBusinessDetails)}
          </Link>
        </li>
      </ul>
    </div>
  );
}

Sidebar.propTypes = {
  intl             : intlShape.isRequired,
  selectedMenuItem : T.oneOf([
    'account.settings',
    'security.change_password',
    'business.settings',
  ]).isRequired,
};

export default injectIntl(Sidebar);

