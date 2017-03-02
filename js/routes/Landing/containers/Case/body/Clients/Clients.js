import React from 'react'

import style from 'routes/Landing/styles';

export default class Clients extends React.Component {
  render() {
    return (
      <div className={style.content}>
        <div className={style.docsList}>
          <div className={style.center}>
            A case seen by a client
          </div>
        </div>
      </div>
    );
  }
}

