import React from 'react'
import { compose } from 'redux';

import moment from 'moment';

import { DateField, TransitionView, Calendar } from 'react-date-picker';

import TextField from 'components/material-ui/TextField';

import style from 'routes/Landing/styles';

import throttle from 'lodash.throttle';

class DT extends React.Component {
  renderInput({ onBlur, ...props }) {
    const  { meta: { touched, error }, input, label, asyncValidate, onRef } = this.props;

    let errorText;
    if (error && touched) {
      errorText = 'Ce champ ne peut pas être vide.';
    }

    function myOnBlur(e) {
      onBlur && onBlur(e);
      // asyncValidate(input.name);
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
    // this.props.asyncValidate(input.name);
  }
  onCollapse() {
    this.props.onNext();
  }
  render() {
    const { onRef, label, showClock = false, input, meta, minDate, locale } = this.props;

    return (
      <div>
        <DateField
          forceValidDate
          dateFormat={showClock === true ? 'YYYY-MM-DD hh:mm a' : 'YYYY-MM-DD'}
          updateOnDateClick={true}
          collapseOnDateClick={showClock === false}
          footer={false}
          renderInput={this.renderInput}
          locale={locale}
          value={input.value}
          onRef={onRef}
          label={label}
          meta={meta}
          onChange={this.onChange}
          onCollapse={this.onCollapse}
          minDate={minDate}
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

