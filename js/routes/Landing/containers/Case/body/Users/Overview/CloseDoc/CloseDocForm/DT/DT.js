import React from 'react'
import { compose } from 'redux';

import moment from 'moment';

import { DateField, TransitionView, Calendar } from 'react-date-picker';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

class DT extends React.Component {
  renderInput({ ...props }) {
    const  { meta: { touched, error }, input, label, onRef } = this.props;

    let errorText;
    if (error && touched) {
      errorText = error.get('date') ? 'Date invalide.' : 'Ce champ ne peut pas être vide.';
    }

    return (
      <TextField
        className={style.addDocTextField}
        floatingLabelText={label}
        errorText={errorText}
        {...props}
        ref={onRef}
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
    const { input } = this.props;
    input.onChange(
      moment.isMoment(dateMoment) && moment(dateMoment).isValid() ? +dateMoment : ''
    );
    this.props.asyncValidate(this.props.name);
  }
  onCollapse() {
    this.props.onNext && this.props.onNext();
  }
  render() {
    const { onRef, label, showClock, forceValidDate = true, input, meta, locale } = this.props;

    return (
      <div>
        <DateField
          forceValidDate={forceValidDate}
          dateFormat={showClock === false ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm a'}
          updateOnDateClick={true}
          footer={false}
          renderInput={this.renderInput}
          locale={locale}
          {...{...input, onRef, label}}
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

export default compose(
)(DT);

