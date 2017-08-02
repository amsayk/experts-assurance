import React from 'react';

import style from 'containers/Importation/styles';

export default class Title extends React.Component {
  render() {
    return (
      <div className={style.titleWrapper}>
        <div className={style.title}>
          <h6>1. Validation</h6>
        </div>
      </div>
    );
  }
}
