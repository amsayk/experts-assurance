import React from 'react'

import style from 'routes/Landing/styles';

export default class Loading extends React.Component {
  render() {
    return (
      <div style={{ height: 50 }} className={style.line}>
        <div className={style.topLine}></div>
        <div className={style.bottomLine}></div>
        <div className={style.clip} style={{ left: `calc(32px * 1.5)`,    width: '13%' }}></div>
        <div className={style.clip} style={{ left: `calc(15%  * ${2})`,   width: '100%' }}></div>
      </div>
    );
  }
}

