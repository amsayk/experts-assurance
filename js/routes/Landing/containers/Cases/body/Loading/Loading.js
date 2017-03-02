import React from 'react'

import style from 'routes/Landing/styles';

export class Line extends React.Component {
  render() {
    return (
      <div className={style.line}>
        <div className={style.topLine}></div>
        <div className={style.bottomLine}></div>
        <div className={style.leftPad}></div>
        <div className={style.rightPad}></div>
        <div className={style.clip} style={{ left: `calc(32px * 2)`,      width: '7%' }}></div>
        <div className={style.clip} style={{ left: `calc(15%  * ${1.7})`, width: '5%' }}></div>
        <div className={style.clip} style={{ left: `calc(15%  * ${3})`,   width: '5%' }}></div>
        <div className={style.clip} style={{ left: `calc(15%  * ${4.2})`, width: '5%' }}></div>
        <div className={style.clip} style={{ left: `calc(15%  * ${5.5})`, width: '5%' }}></div>
      </div>
    );
  }
}

