import React from 'react'

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import style from 'routes/Landing/styles';

import { MoreHorizIcon } from 'components/icons/MaterialIcons';

export default class DocMenu extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(key) {
    if (key === 'close') {
      this.props.onClose();
    }
    if (key === 'cancel') {
      this.props.onCancel();
    }
    if (key === 'delete') {
      this.props.onDelete();
    }
  }
  render() {
    const { user, doc } = this.props;
    return (
      <Dropdown
        pullRight
        onSelect={this.onSelect}
      >
        <Dropdown.Toggle className={style.docMenuAction}>
          <MoreHorizIcon size={32}/>
        </Dropdown.Toggle>
        <Dropdown.Menu className={style.docMenu}>
          <MenuItem eventKey='close'>Clôturer</MenuItem>
          <MenuItem eventKey='cancel'>Annuler</MenuItem>
          {user.isAdmin || user.isDocManager(doc) ? [
            <MenuItem divider />,
            <MenuItem eventKey='delete'>Supprimer</MenuItem>
          ] : null}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

