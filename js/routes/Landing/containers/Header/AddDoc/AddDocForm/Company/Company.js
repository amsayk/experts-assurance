import React from 'react'
import { compose } from 'redux';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

class Company extends React.Component {
  render() {
    const { onKeyDown, label : floatingLabelText, onRef, className, input, meta: { touched, error, ...meta } } = this.props;
    let errorText;

    if (error && touched) {
      errorText = 'Ce champ ne peut pas être vide.';
    }

    return (
      <div>
        <TextField
          ref={onRef}
          className={className}
          floatingLabelText={floatingLabelText}
          onKeyDown={onKeyDown}
          errorText={errorText}
          {...input}
        />
      </div>

    );
  }
}

export default compose()(Company);

