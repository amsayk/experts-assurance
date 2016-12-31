import React from 'react';

import style from '../Settings.scss';

import { injectIntl, intlShape } from 'react-intl';

function EmailField({ intl, label, input }) {
  return (
    <div className={style.emailField}>
      <label htmlFor={input.name} className={style.label}>{label}</label>
      <div className={style.inputWrapper}>
        <p className={style.email}>{input.value}</p>
      </div>
    </div>
  );
}

EmailField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(EmailField);

