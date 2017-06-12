import React from 'react'

import { CloseIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

import style from 'routes/Landing/styles';

export default class SelectedCompanyToggle extends React.Component {
  constructor() {
    super();

    this.onClear = this.onClear.bind(this);
    this.onClearOpen = this.onClearOpen.bind(this);
  }
  onClear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClear();
  }
  onClearOpen(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClear();
    this.props.onOpen();
  }
  render() {
    const { loading, company } = this.props;

    return (
      <Button onClick={this.onClear} className={style.selectedUserButton} role='button'>
        <div className={style.text} style={{ marginRight: 5 }}>
          {company}
        </div>
        <CloseIcon className={style.closeIcon} size={12}/>
      </Button>
    );
  }
}

