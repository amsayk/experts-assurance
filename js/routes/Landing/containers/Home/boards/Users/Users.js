import React from 'react'

import style from 'routes/Landing/styles';

import Pending from './Pending';
import Open from './Open';
import Closed from './Closed';

export default class Users extends React.PureComponent {
  render() {
    return (
      <div className={style.boards}>
        <Pending/>
        <Open/>
        <Closed/>
      </div>
    );
  }
}

