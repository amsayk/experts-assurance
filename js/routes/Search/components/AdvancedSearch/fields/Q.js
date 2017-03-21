import React from 'react'

import style from 'routes/Search/styles';

export default class Q extends React.Component {
  render() {
    return (
      <div className={style.advancedSearch_field}>
        <div className={style.advancedSearch_field_label}>
          Mots clés
        </div>
        <div className={style.advancedSearch_field_info}>
          Selection
        </div>
      </div>
    );
  }
}

