import React from 'react';

import style from '../Settings.scss';

import { injectIntl, intlShape } from 'react-intl';

function BusinessDescriptionField({ intl, label, input }) {
  return (
    <div className={style.formGroup}>
      <label htmlFor={input.name} className={style.label}>{label}</label>
      <div className={style.inputWrapper}>
        <textarea
          {...input}
          rows={5}
          style={{ resize: 'none' }}
          className={style.control}/>
      </div>
    </div>
  );
}

BusinessDescriptionField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(BusinessDescriptionField);

