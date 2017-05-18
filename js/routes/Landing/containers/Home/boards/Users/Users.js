import React from 'react'

import style from 'routes/Landing/styles';

// import Pending from './Pending';
import Open from './Open';
import Unpaid from './Unpaid';
import Invalid from './Invalid';
// import Closed from './Closed';

export default class Users extends React.PureComponent {
  render() {
    return (
      <div className={style.boards}>
        {/* <Pending/> */}
        <Open/>
        <Unpaid/>
        <Invalid/>
        {/* <Closed/> */}
      </div>
    );
  }
}

