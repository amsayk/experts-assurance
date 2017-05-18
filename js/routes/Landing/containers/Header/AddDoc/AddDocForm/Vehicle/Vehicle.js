import React from 'react'

import { Field } from 'redux-form/immutable';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

function renderField({ name, onKeyDown, floatingLabelText, onRef, className, input, meta: { touched, error } }) {
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
      {...input}
    />

  );
}

export default class Vehicle extends React.Component {
  render() {
    const { onKeyDown, ...props } = this.props;

    return (
      <section className={style.addDocSection}>
        <header>
          <h5>Véhicule</h5>
        </header>
        <article>
          <Field
            name='vehicleManufacturer'
            props={{
              onKeyDown,
              className : style.addDocTextField,
              floatingLabelText : 'Fabricant',
            }}
            component={renderField}
          />
          <Field
            name='vehicleModel'
            props={{
              onKeyDown,
              className : style.addDocTextField,
              floatingLabelText : 'Type',
            }}
            component={renderField}
          />
        </article>
        <article>
          <Field
            name='vehiclePlateNumber'
            props={{
              onKeyDown,
              className : style.addDocTextField,
              floatingLabelText : 'Immatriculation',
            }}
            component={renderField}
          />
          <Field
            name='vehicleSeries'
            props={{
              onKeyDown,
              className : style.addDocTextField,
              floatingLabelText : 'Série',
            }}
            component={renderField}
          />
        </article>
        <article>
          <Field
            name='vehicleMileage'
            props={{
              onKeyDown,
              className : style.addDocTextField,
              floatingLabelText : 'Kilométrage',
            }}
            component={renderField}
          />
          <Field
            name='vehicleDMC'
            props={{
              onKeyDown,
              className : style.addDocTextField,
              floatingLabelText : 'DMC',
            }}
            component={renderField}
          />
        </article>
        <article>
          <Field
            name='vehicleEnergy'
            props={{
              onKeyDown,
              className : style.addDocTextField,
              floatingLabelText : 'Energie',
            }}
            component={renderField}
          />
          <Field
            name='vehiclePower'
            props={{
              onKeyDown,
              className : style.addDocTextField,
              floatingLabelText : 'Puissance',
            }}
            component={renderField}
          />
        </article>
      </section>
    );
  }
}

