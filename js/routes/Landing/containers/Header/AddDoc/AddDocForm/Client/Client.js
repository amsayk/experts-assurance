import React from 'react';
import T from 'prop-types';
import { compose } from 'redux';

import { connect } from 'react-redux';

import TextField from 'components/material-ui/TextField';

import {
  Field,
  getFormValues,
  clearAsyncError,
  change,
} from 'redux-form/immutable';

import style from 'routes/Landing/styles';

import fieldErrorSelector from '../fieldErrorSelector';

import { createSelector } from 'utils/reselect';

import MatchingUsers from '../MatchingUsers';

function getError(error, fieldName) {
  return error.get ? error.get(fieldName) || error[fieldName] : error[fieldName];
}

const renderField = connect(fieldErrorSelector('client'))(function({
  client,
  onChange,
  onKeyDown,
  floatingLabelText,
  className,
  input,
  meta: { touched, error },
}) {
  let errorText;

  if (touched) {
    if (error) {
      if (getError(error, 'required')) {
        errorText = 'Ce champ ne peut pas être vide.';
      }
      if (getError(error, 'email')) {
        errorText = 'Cet adresse e-mail est invalide.';
      }
    }

    if (client && getError(client, 'promise')) {
      errorText =
        input.name == 'clientDisplayName'
          ? 'Cet utilisateur exist déja, vous devez le selectionner.'
          : <div />;
    }
  }

  return (
    <TextField
      className={className}
      floatingLabelText={floatingLabelText}
      onKeyDown={onKeyDown}
      errorText={errorText}
      {...input}
      onChange={onChange}
    />
  );
});

class Client extends React.Component {
  static contextTypes = {
    store: T.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.onNameChange = this.onNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
  }
  onNameChange(e) {
    const { userKey } = this.props;
    const changes = [
      // clearAsyncError('addDoc', 'client'),
      change('addDoc', 'clientDisplayName', e.target.value),
      change('addDoc', 'clientId', null, /* touch = */ false),
      change('addDoc', 'clientKey', null, /* touch = */ false),
    ];

    if (userKey === 'id') {
      changes.push(change('addDoc', 'clientEmail', null));
    }
    this.context.store.dispatch(changes);
    setTimeout(this.props.asyncValidate, 0);
  }
  onEmailChange(e) {
    const { userKey } = this.props;
    const changes = [
      // clearAsyncError('addDoc', 'client'),
      change('addDoc', 'clientEmail', e.target.value),
      change('addDoc', 'clientKey', null, /* touch = */ false),
      change('addDoc', 'clientId', null, /* touch = */ false),
    ];

    if (userKey === 'id') {
      changes.push(change('addDoc', 'clientDisplayName', null));
    }
    this.context.store.dispatch(changes);
    setTimeout(this.props.asyncValidate, 0);
  }
  render() {
    const { onKeyDown } = this.props;

    return (
      <section className={style.addDocSection}>
        <header>
          <h5>Assuré</h5>
        </header>
        <article>
          <Field name='clientKey' type='hidden' component='input' />
          <Field name='clientId' type='hidden' component='input' />
          <Field
            name='clientDisplayName'
            props={{
              onKeyDown,
              onChange: this.onNameChange,
              className: style.addDocTextField,
              floatingLabelText: 'Nom complet',
            }}
            component={renderField}
          />
          <Field
            name='clientEmail'
            props={{
              onKeyDown,
              onChange: this.onEmailChange,
              className: style.addDocTextField,
              floatingLabelText: 'Adresse e-mail',
            }}
            component={renderField}
          />
        </article>
        <Field name='client' type='CLIENT' component={MatchingUsers} />
      </section>
    );
  }
}

const keySelector = state => {
  const values = getFormValues('addDoc')(state);
  return values ? values.get('clientKey') : null;
};

const selector = createSelector(keySelector, userKey => ({ userKey }));

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(Connect)(Client);
