import React from 'react';

import style from 'containers/Importation/styles';

import Title from './Title';
import Actions from './Actions';
import DocsList from './DocsList';
import FileList from '../Files/FileList';

export default class Upload extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onOpen = this.onOpen.bind(this);
  }
  onOpen() {}

  render() {
    return (
      <div className={style.body}>
        <Title />
        <FileList mutations={false} />
        <DocsList />
        <Actions />
      </div>
    );
  }
}
