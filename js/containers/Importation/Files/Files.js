import React from 'react';

import style from 'containers/Importation/styles';

import Title from './Title';
import Actions from './Actions';
import FileChooser from './FileChooser';
import FileList from './FileList';

export default class Files extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onOpen = this.onOpen.bind(this);
  }
  onOpen() {}
  render() {
    return (
      <div className={style.body}>
        <Title />
        <FileList />
        <FileChooser />
        <Actions />
      </div>
    );
  }
}
