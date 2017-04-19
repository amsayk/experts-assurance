import React from 'react'

import { Field } from 'redux-form/immutable';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

function renderField({ autoFocus, onKeyDown, floatingLabelText, onRef, className, input, meta: { touched, error } }) {
  let errorText;

  if (error && touched) {
    errorText = 'Ce champ ne peut pas être vide.';
  }

  return (
    <TextField
      ref={onRef}
      className={className}
      floatingLabelText={floatingLabelText}
      onKeyDown={onKeyDown}
      errorText={errorText}
      autoFocus={autoFocus}
      {...input}
    />

  );
}

export default class Vehicle extends React.Component {
  render() {
    const { onVehicleModelInput, onKeyDown, ...props } = this.props;

    return (
      <section className={style.addDocSection}>
        <header>
          <h5>Véhicule</h5>
        </header>
        <article>
          <Field
            name='vehicleModel'
            props={{
              onKeyDown,
              autoFocus : true,
              onRef : onVehicleModelInput,
              className : style.addDocTextField,
              floatingLabelText : 'Modèle',
            }}
            component={renderField}
          />
          <Field
            name='vehiclePlateNumber'
            props={{
              onKeyDown,
              className : style.addDocTextField,
              floatingLabelText : 'Immatriculation',
            }}
            component={renderField}
          />
        </article>
      </section>
    );
  }
}

