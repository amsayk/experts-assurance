import React from 'react';

import messages from '../messages';

import style from '../ProductCatalog.scss';

import { injectIntl, intlShape } from 'react-intl';

function BrandNameField({ intl, placeholder, onKeyDown, input }) {
  return (
    <div className={style.formGroup}>
      <input
        {...input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoComplete={'off'}
        type={'text'}
        className={style.control}
      />

    <p className={style.note}>
      {intl.formatMessage(messages.brandNameNote)}
    </p>
    </div>
  );
}

BrandNameField.propTypes = {
  intl : intlShape.isRequired,
};

export default injectIntl(BrandNameField);

