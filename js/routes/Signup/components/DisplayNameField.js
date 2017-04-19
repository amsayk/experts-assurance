import React from 'react';

import messages from '../messages';

import style from '../Signup.scss';

function DisplayNameField({ placeholder, onKeyDown, input, meta: {} }) {
  return (
    <div className={style.formGroup}>
      <input
        {...input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoFocus
        autoComplete={'off'}
        type={'text'}
        className={style.control}
      />

  </div>
  );
}

DisplayNameField.propTypes = {
};

export default DisplayNameField;

