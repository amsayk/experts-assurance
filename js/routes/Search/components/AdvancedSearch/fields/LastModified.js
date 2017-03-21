import React from 'react'

import style from 'routes/Search/styles';

import DatePicker from './react-dates/Date';

export default class LastModified extends React.Component {
    constructor() {
    super()

    this.onDate = this.onDate.bind(this);
  }
  onDate(date) {
    if (date) {
      this.props.onDate(date)
    } else {
      this.props.onDate(null);
    }
  }
  render() {
    const { date } = this.props;
    return (
      <div className={style.advancedSearch_field}>
        <div className={style.advancedSearch_field_label}>
          Dernière mise à jour
        </div>
        <div className={style.advancedSearch_field_info}>
          <DatePicker
            initialDate={date}
            onDate={this.onDate}
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

