import React from 'react'
import { compose } from 'redux';

import { DateField, TransitionView, Calendar } from 'react-date-picker';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

class DT extends React.Component {
  renderInput({...props }) {
    const  { meta: { touched, error } } = this.props;

    let errorText;
    if (error && touched) {
      errorText = 'Ce champ ne peut pas être vide.';
    }

    return (
      <TextField
        className={style.addDocTextField}
        floatingLabelText='DT Sinistre'
        errorText={errorText}
        {...props}
      />
    );
  }

  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }
  onChange(_, { dateMoment, timestamp }) {
    const { input, onNext } = this.props;
    input.onChange(+dateMoment);
  }
  onCollapse() {
    this.props.onNext();
  }
  render() {
    const { onRef, input, meta, locale } = this.props;

    return (
      <div>
        <DateField
          forceValidDate
          dateFormat='YYYY-MM-DD hh:mm a'
          updateOnDateClick={true}
          footer={false}
          renderInput={this.renderInput}
          locale={locale}
          {...input}
          meta={meta}
          onChange={this.onChange}
          onCollapse={this.onCollapse}
          ref={onRef}
        >
          <TransitionView>
            <Calendar style={{padding: 10}}/>
          </TransitionView>
        </DateField>
      </div>
    );
  }
}

export default compose(
)(DT);

