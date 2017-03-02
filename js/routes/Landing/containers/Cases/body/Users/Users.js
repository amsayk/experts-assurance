import React from 'react'

import style from 'routes/Landing/styles';

import Header from './Header_Filters';
import List from './Cases_List';

export default class Users extends React.Component {
  render() {
    return (
      <div className={style.content}>
        <div className={style.docs}>
          <Header user={this.props.user}/>
          <List/>
        </div>
      </div>
    );
  }
}

