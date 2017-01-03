import React from 'react';
import { Link } from 'react-router';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_CHANGE_EMAIL } from 'vars';

import style from '../Settings.scss';

import { injectIntl, intlShape } from 'react-intl';

function EmailField({ intl, label, input }) {
  return (
    <div className={style.emailField}>
      <label htmlFor={input.name} className={style.label}>{label}</label>
      <div className={style.inputWrapper}>
        <p className={style.email}>{input.value}{' '}<Link className={style.changeEmailButton} to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_EMAIL}><i className={style.changeEmailIcon}>edit</i></Link></p>
      </div>
    </div>
  );
}

EmailField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(EmailField);

