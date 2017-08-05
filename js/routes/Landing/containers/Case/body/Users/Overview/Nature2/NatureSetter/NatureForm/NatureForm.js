import React from 'react';
import { compose } from 'redux';

import moment from 'moment';

import Button from 'components/bootstrap/Button';

import { DateField, TransitionView, Calendar } from 'react-date-picker';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

import {
  SubmissionError,
  Field,
  reduxForm,
  propTypes as formPropTypes,
} from 'redux-form/immutable';

import validations from './validations';

function renderField({
  name,
  multiLine = false,
  onKeyDown,
  floatingLabelText,
  onRef,
  className,
  input,
  meta: { touched, error },
}) {
  let errorText;

  if (error && touched) {
    errorText = 'Ce champ ne peut pas être vide.';
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

class NatureForm extends React.Component {
  constructor(props) {
    super(props);

    this.onKeyDown = this._onKeyDown.bind(this);
  }

  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      const submit = this.props.handleSubmit(this.props.onSubmit);
      submit();
    }
  }

  componentDidMount() {}
  render() {
    const {
      onInputRef,
      handleSubmit,
      pristine,
      submitting,
      invalid,
    } = this.props;
    return (
      <div style={styles.root}>
        <h5 style={styles.header}>Nature du dossier</h5>

        <Field
          name='nature'
          props={{
            onRef: onInputRef,
            onKeyDown: this.onKeyDown,
            // floatingLabelText: 'Nature',
            multiLine: true,
          }}
          component={renderField}
        />

        <div style={{ marginTop: 15 }} />

        <Button
          style={styles.btn}
          disabled={submitting || invalid}
          bsStyle='primary'
          onClick={handleSubmit}
          role='button'
        >
          Valider
        </Button>
      </div>
    );
  }
}

const styles = {};

styles.root = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  position: 'relative',
  padding: '0 10px 10px',
};

styles.header = {
  textTransform: 'uppercase',
  color: '#7d97ad',
  fontSize: '.8125rem',
  fontWeight: 600,
  marginTop: 12,
};

styles.btn = {
  width: 75,
  marginTop: 25,
};

const WithForm = reduxForm({
  form: 'setNature',
  keepDirtyOnReinitialize: false,
  enableReinitialize: true,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  ...validations,
});

export default compose(WithForm)(NatureForm);
