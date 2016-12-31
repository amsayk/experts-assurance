import React from 'react';

import cx from 'classnames';

import style from '../Settings.scss';

import { injectIntl, intlShape } from 'react-intl';

function OptionalTextInputField({ intl, label, className, onKeyDown, input }) {
  return (
    <div className={style.formGroup}>
      <label htmlFor={input.name} className={style.label}>{label}</label>
      <div className={style.inputWrapper}>
        <input
          {...input}
          onKeyDown={onKeyDown}
          className={cx(style.control, className)}/>
      </div>
    </div>
  );
}

OptionalTextInputField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(OptionalTextInputField);

