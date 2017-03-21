import React from 'react'

import style from 'routes/Search/styles';

import DateRangePicker from './react-dates/Range';

export default class DTClosure extends React.Component {
  constructor() {
    super()

    this.onRange = this.onRange.bind(this);
  }
  onRange(range) {
    if (range) {
      this.props.onRange({
        from: range.from,
        to: range.to,
      })
    } else {
      this.props.onRange(null);
    }
  }
  render() {
    const { range, state } = this.props;

    if (state === 'PENDING' || state === 'OPEN') {
      return null;
    }

    return (
      <div className={style.advancedSearch_field}>
        <div className={style.advancedSearch_field_label}>
          DT Clôture
        </div>
        <div className={style.advancedSearch_field_info}>
          <DateRangePicker
            initialStartDate={range.from}
            initialEndDate={range.to}
            onRange={this.onRange}
            showClearDates
            phrases={{
              closeDatePicker: 'Fermer',
              clearDates: 'Annuler',
            }}
          />
        </div>
      </div>
    );
  }
}

