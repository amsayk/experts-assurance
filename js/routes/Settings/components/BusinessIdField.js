import React from 'react';

import style from '../Settings.scss';

import { injectIntl, intlShape } from 'react-intl';

function BusinessIdField({ intl, label, input }) {
  if (!input.value) {
    return null;
  }
  return (
    <div className={style.emailField}>
      <label htmlFor={input.name} className={style.label}>{label}</label>
      <div className={style.inputWrapper}>
        <p className={style.id}>{input.value}</p>
      </div>
    </div>
  );
}

BusinessIdField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(BusinessIdField);

