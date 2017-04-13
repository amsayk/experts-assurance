import React from 'react';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import focusNode from 'focusNode';

import raf from 'requestAnimationFrame';

import style from 'routes/Search/styles';

import cx from 'classnames';

import SelectedUserToggle from '../SelectedUserToggle';

import { Role_ADMINISTRATORS, Role_MANAGERS } from 'roles';

import createUserPicker from '../PickUser';

const PickUser = createUserPicker(Role_ADMINISTRATORS, Role_MANAGERS);

export default class Manager extends React.Component {
  state ={
    open : false,
  }
  constructor() {
    super();

    this.onToggle = this.onToggle.bind(this);
    this.onUser = this.onUser.bind(this);
    this._onInput = this._onInput.bind(this);
  }
  onToggle() {
    this.setState(({ open }) => ({
      open : !open,
    }), () => {
      if (!this.state.open) {
      } else {
        raf(() => focusNode(this._input));
      }
    });
  }
  onUser(id) {
    this.props.onManager(id);
    this.setState({
      open : false,
    });
  }
  _onInput(input) {
    this._input = input;
  }
  render() {
    const { manager, onManager } = this.props;
    return (
      <div className={style.advancedSearch_field}>
        <div className={style.advancedSearch_field_label}>
          Gestionnaire
        </div>
        <div className={style.advancedSearch_field_info}>
          <div className={style.filterGroup}>
            <div className={cx(this.state.open && style.mask)}></div>
            <Dropdown
              open={this.state.open}
              onToggle={this.onToggle}
              className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
            >
              {manager ? <SelectedUserToggle onClear={onManager} id={manager.get('id')}/> : <Dropdown.Toggle className={style.togglePickUser}>
                Filtre par un gestionnaire
              </Dropdown.Toggle>}
              <Dropdown.Menu className={style.userPickerMenu}>
                <MenuItem open={this.state.open} onInput={this._onInput} onUser={this.onUser} componentClass={PickUser}/>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

