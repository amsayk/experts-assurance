import React from 'react'

import style from 'routes/Landing/styles';

import Overview from './Overview';

export default class Users extends React.Component {
  render() {
    const { intl, id, user } = this.props;
    return (
      <div className={style.content}>
        <div className={style.docs}>
          <Overview id={id} user={user}/>
        </div>
      </div>
    );
  }
}

