import React from 'react'
import { compose } from 'redux';

import moment from 'moment';

import Button from 'components/bootstrap/Button';

import { DateField, TransitionView, Calendar } from 'react-date-picker';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

import { SubmissionError, Field, reduxForm, propTypes as formPropTypes } from 'redux-form/immutable';

import { injectIntl } from 'react-intl';

import DT from '../DT';

function parseDate(s) {
  return +moment.utc(s);
}

function _parseFloat(s) {
  const val = s ? parseFloat(s) : null;
  return isNaN(val) ? null : val;
}

function renderField({ name, multiLine = false, onKeyDown, floatingLabelText, onRef, className, input, meta: { touched, error } }) {
  let errorText;

  if (error && touched) {
    errorText = error.get('number') ? 'Veuillez entrer des chiffres valides.' : 'Ce champ ne peut pas être vide.';
  }

  const props = {};

  if (multiLine) {
    props.rows = 2;
    props.rowsMax = 5;
  } else {
    props.onKeyDown = onKeyDown;
  }

  return (
    <TextField
      {...props}
      ref={onRef}
      className={className}
      floatingLabelText={floatingLabelText}
      errorText={errorText}
      multiLine={multiLine}
      {...input}
    />

  );
}

class PaymentForm extends React.Component {
  componentDidMount() {
  }
  render() {
    const {
      intl,
      onPaymentFirstChild,
      pristine,
      submitting,
      invalid,
      asyncValidate,
      onKeyDown,
    } = this.props;
    return (
      <div style={styles.root}>
        <h5 style={styles.header}>
          Détail de paiement
        </h5>

        <Field
          name='paymentAmount'
          parse={_parseFloat}
          props={{
            onRef             : onPaymentFirstChild,
            onKeyDown         : onKeyDown,
            floatingLabelText : 'MT',
          }}
          component={renderField} />

        <br/>

        <Field
          name='paymentDate'
          parse={parseDate}
          props={{
            asyncValidate,
            onKeyDown : onKeyDown,
            label     : 'DT Paiement',
          }}
          component={DT} />

        <br/>

        <Field
          name='paymentDescription'
          props={{
            multiLine          : true,
            floatingLabelText : 'Remarques (optionnel)',
          }}
          component={renderField} />

      </div>
    );
  }
}

const styles = {};

styles.root = {
  display       : 'flex',
  flexDirection : 'column',
  flex          : 1,
  position      : 'relative',
};

styles.header = {
  textTransform : 'uppercase',
  fontSize      : '.8125rem',
  fontWeight    : 600,
  marginTop     : 12,
  color         : '#7d97ad',
};

styles.btn = {
  width: 75,
  marginTop: 25,
};

export default compose(
  injectIntl,
)(PaymentForm);

