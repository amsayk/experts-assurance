import React from 'react';
import { Link } from 'react-router';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_CHANGE_EMAIL } from 'vars';

import style from '../Settings.scss';

import { injectIntl, intlShape } from 'react-intl';

import Tooltip from 'components/react-components/Tooltip';

import messages from '../messages';

import { PencilIcon } from 'components/icons/MaterialIcons';

const tooltipAlign = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

function EmailField({ intl, label, input }) {
  return (
    <div className={style.emailField}>
      <label htmlFor={input.name} className={style.label}>{label}</label>
      <div className={style.inputWrapper}>
        <p className={style.email}>
          {input.value}
          {' '}
          <Tooltip align={tooltipAlign} overlay={intl.formatMessage(messages.changeEmail)}>
            <Link className={style.changeEmailButton} to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_EMAIL}>
              <PencilIcon className={style.changeEmailIcon} size={18}/>
            </Link>
          </Tooltip>
        </p>
      </div>
    </div>
  );
}

EmailField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(EmailField);

