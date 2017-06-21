import React from 'react'
import { compose } from 'redux';

import moment from 'moment';

import Button from 'components/bootstrap/Button';

import { DateField, TransitionView, Calendar } from 'react-date-picker';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

import { SubmissionError, Field, reduxForm, propTypes as formPropTypes } from 'redux-form/immutable';

import validations from './validations';

import throttle from 'lodash.throttle';

function parseDate(s) {
  return +moment.utc(s);
}

function getError(error, fieldName) {
  return error.get ? error.get(fieldName) || error[fieldName] : error[fieldName];
}

class DT extends React.Component {
  renderInput({ onBlur, ...props }) {
    const  { meta: { touched, error }, input, label, asyncValidate, onRef } = this.props;

    let errorText;
    if (error && touched) {
      errorText = getError(error, 'date') ? 'Date invalide.' : 'Ce champ ne peut pas être vide.';
    }

    function myOnBlur(e) {
      onBlur && onBlur(e);
      asyncValidate(input.name);
    }

    return (
      <TextField
        className={style.addDocTextField}
        floatingLabelText={label}
        errorText={errorText}
        {...props}
        onBlur={myOnBlur}
        ref={onRef}
      />
    );
  }

  constructor() {
    super();

    this.onChange = throttle(this.onChange.bind(this), 100);
    this.onCollapse = this.onCollapse.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }
  onChange(_, { dateMoment, timestamp }) {
    const { input } = this.props;
    input.onChange(
      dateMoment
      ? moment.isMoment(dateMoment) && moment(dateMoment).isValid() ? +dateMoment : ''
      : null
    );
    this.props.asyncValidate(input.name);
  }
  onCollapse() {
  }
  render() {
    const { onRef, label, input, meta, locale } = this.props;

    return (
      <div>
        <DateField
          forceValidDate
          dateFormat='YYYY-MM-DD'
          updateOnDateClick={true}
          collapseOnDateClick={true}
          footer={false}
          renderInput={this.renderInput}
          locale={locale}
          value={input.value}
          onRef={onRef}
          label={label}
          meta={meta}
          onChange={this.onChange}
          onCollapse={this.onCollapse}
        >
          <TransitionView>
            <Calendar style={{padding: 10}}/>
          </TransitionView>
        </DateField>
      </div>
    );
  }

}

class DTValidationForm extends React.Component {
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

  componentDidMount() {
  }
  render() {
    const {
      onInputRef,
      handleSubmit,
      pristine,
      submitting,
      invalid,
      asyncValidate,
    } = this.props;
    return (
      <div style={styles.root}>
        <h5 style={styles.header}>
          Détaille de Validation
        </h5>

        <Field
          name='date'
          parse={parseDate}
          props={{
            asyncValidate,
            onRef     : onInputRef,
            onKeyDown : this.onKeyDown,
            label     : 'DT Validation',
          }}
          component={DT} />

        <div style={{marginTop: 15}}></div>

        <Button style={styles.btn} disabled={submitting || invalid} bsStyle='primary' onClick={handleSubmit} role='button'>
          Valider
        </Button>
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
  padding       : '0 10px 10px',
};

styles.header = {
  textTransform : 'uppercase',
  color         : '#7d97ad',
  fontSize      : '.8125rem',
  fontWeight    : 600,
  marginTop     : 12,
};

styles.btn = {
  width: 75,
  marginTop: 25,
};

const WithForm = reduxForm({
  form: 'setDTValidation',
  keepDirtyOnReinitialize   : false,
  enableReinitialize        : true,
  destroyOnUnmount          : true,
  forceUnregisterOnUnmount  : true,
  ...validations,
});

export default compose(
  WithForm,
)(DTValidationForm);

