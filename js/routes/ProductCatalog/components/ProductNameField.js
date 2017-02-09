import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import messages from '../messages';

import style from '../ProductCatalog.scss';

import { injectIntl, intlShape } from 'react-intl';

function ProductNameField({ intl, placeholder, onKeyDown, input, meta: { touched, error } }) {
  return (
    <div className={cx(style.formGroup, { [style.formGroupHasDanger]: touched && error })}>
      <input
        {...input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoFocus
        autoComplete={'off'}
        type={'text'}
        className={cx(style.control, { [style.formControlDanger]: touched && error })}
      />
      <FormMessages errorCount={1} field={input.name}>
        <div className={style.formControlFeedback} when={'required'}>
          {intl.formatMessage(validationMessages.productNameRequired)}
        </div>
        <div className={style.formControlFeedback} when={'productName'}>
          {intl.formatMessage(validationMessages.productNameTaken)}
        </div>
      </FormMessages>
      {error || <p className={style.note}>{intl.formatMessage(messages.productNameNote)}</p>}
    </div>
  );
}

ProductNameField.propTypes = {
  intl : intlShape.isRequired,
};

export default injectIntl(ProductNameField);

