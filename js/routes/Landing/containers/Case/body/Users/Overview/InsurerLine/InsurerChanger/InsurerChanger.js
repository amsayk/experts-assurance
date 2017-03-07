import React from 'react';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import focusNode from 'focusNode';

import raf from 'requestAnimationFrame';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import SelectedUserToggle from './SelectedUserToggle';

import { Role_INSURERS } from 'roles';

import createUserPicker from './PickInsurer';

const PickInsurer = createUserPicker(Role_INSURERS);

class InsurerChanger extends React.Component {
  state ={
    open : false,
    queryString : '',
    selectedUserId : null,
  };
  constructor() {
    super();

    this.onToggle = this.onToggle.bind(this);
    this.onUser = this.onUser.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onAction = this.onAction.bind(this);
    this._onInput = this._onInput.bind(this);
  }
  onSearch(queryString) {
    this.setState({
      queryString,
    });
  }
  onToggle() {
    this.setState(({ open }) => ({
      open : !open,
    }), () => {
      if (this.state.open) {
        raf(() => focusNode(this._input));
      }
    });
  }
  onUser(id) {
    this.setState(({ selectedUserId }) => ({
      selectedUserId : selectedUserId === id ? null : id,
    }));
  }
  onAction() {
    this.setState({
      open : false,
      selectedUserId : null,
      queryString : '',
    });
  }
  _onInput(input) {
    this._input = input;
  }
  render() {
    const { agent, actions } = this.props;
    return (
      <div className={style.filterGroup}>
        <div className={cx(this.state.open && style.mask)}></div>
        <Dropdown
          open={this.state.open}
          onToggle={this.onToggle}
          className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
        >
          <SelectedUserToggle onOpen={this.onToggle} user={agent}/>
          <Dropdown.Menu className={style.userPickerMenu}>
            <MenuItem
              onAction={this.onAction}
              queryString={this.state.queryString}
              selectedUserId={this.state.selectedUserId}
              open={this.state.open}
              onInput={this._onInput}
              onUser={this.onUser}
              onSearch={this.onSearch}
              componentClass={PickInsurer}
            />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

export default InsurerChanger;

