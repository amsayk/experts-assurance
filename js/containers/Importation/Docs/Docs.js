import React from 'react';

import style from 'containers/Importation/styles';

import Title from './Title';
import Actions from './Actions';
import DocsList from './DocsList';

export default class Docs extends React.PureComponent {
  render() {
    return (
      <div className={style.body}>
        <Title />
        <DocsList />
        <Actions />
      </div>
    );
  }
}
