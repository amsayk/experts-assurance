import React from 'react';
import T from 'prop-types';
import { compose } from 'redux';

import { connect } from 'react-redux';

import {
  Field,
  getFormValues,
  clearAsyncError,
  change,
} from 'redux-form/immutable';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

import { createSelector } from 'utils/reselect';

import MatchingUsers from '../MatchingUsers';

import fieldErrorSelector from '../fieldErrorSelector';

function getError(error, fieldName) {
  return error.get ? error.get(fieldName) || error[fieldName] : error[fieldName];
}

const renderField = connect(fieldErrorSelector('agent'))(function({
  agent,
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

    if (agent && getError(agent, 'promise')) {
      errorText =
        input.name == 'agentDisplayName'
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

class Agent extends React.Component {
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
      // clearAsyncError('addDoc', 'agent'),
      change('addDoc', 'agentDisplayName', e.target.value),
      change('addDoc', 'agentKey', null, /* touch = */ false),
      change('addDoc', 'agentId', null, /* touch = */ false),
    ];

    if (userKey === 'id') {
      changes.push(change('addDoc', 'agentEmail', null));
    }
    this.context.store.dispatch(changes);
    setTimeout(this.props.asyncValidate, 0);
  }
  onEmailChange(e) {
    const { userKey } = this.props;
    const changes = [
      // clearAsyncError('addDoc', 'agent'),
      change('addDoc', 'agentEmail', e.target.value),
      change('addDoc', 'agentKey', null, /* touch = */ false),
      change('addDoc', 'agentId', null, /* touch = */ false),
    ];

    if (userKey === 'id') {
      changes.push(change('addDoc', 'agentDisplayName', null));
    }
    this.context.store.dispatch(changes);
    setTimeout(this.props.asyncValidate, 0);
  }
  render() {
    const { onKeyDown } = this.props;

    return (
      <section className={style.addDocSection}>
        <header>
          <h5>Agent</h5>
        </header>
        <article>
          <Field name='agentKey' type='hidden' component='input' />
          <Field name='agentId' type='hidden' component='input' />
          <Field
            name='agentDisplayName'
            props={{
              onKeyDown,
              onChange: this.onNameChange,
              className: style.addDocTextField,
              floatingLabelText: 'Nom complet',
            }}
            component={renderField}
          />
          <Field
            name='agentEmail'
            props={{
              onKeyDown,
              onChange: this.onEmailChange,
              className: style.addDocTextField,
              floatingLabelText: 'Adresse e-mail',
            }}
            component={renderField}
          />
        </article>
        <Field name='agent' type='AGENT' component={MatchingUsers} />
      </section>
    );
  }
}

const keySelector = state => {
  const values = getFormValues('addDoc')(state);
  return values ? values.get('agentKey') : null;
};

const selector = createSelector(keySelector, userKey => ({ userKey }));

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(Connect)(Agent);
