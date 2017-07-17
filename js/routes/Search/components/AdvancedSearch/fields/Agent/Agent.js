import React from 'react';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import focusNode from 'focusNode';

import raf from 'utils/requestAnimationFrame';

import style from 'routes/Search/styles';

import cx from 'classnames';

import SelectedUserToggle from '../SelectedUserToggle';

import { Role_AGENTS } from 'roles';

import createUserPicker from '../PickUser';

const PickUser = createUserPicker(Role_AGENTS);

export default class Agent extends React.Component {
  state ={
    open : false,
  }
  constructor() {
    super();

    this.onToggle = this.onToggle.bind(this);
    this.onUser   = this.onUser.bind(this);
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
    this.props.onAgent(id);
    this.setState({
      open : false,
    });
  }
  _onInput(input) {
    this._input = input;
  }
  render() {
    const { agent, onAgent } = this.props;
    return (
      <div className={style.advancedSearch_field}>
        <div className={style.advancedSearch_field_label}>
          Agent
        </div>
        <div className={style.advancedSearch_field_info}>
          <div className={style.filterGroup}>
            <div className={cx(this.state.open && style.mask)}></div>
            <Dropdown
              open={this.state.open}
              onToggle={this.onToggle}
              className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
            >
              {agent ? <SelectedUserToggle onClear={onAgent} id={agent.get('id')}/> : <Dropdown.Toggle className={style.togglePickUser}>
                Filtre par un agent
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
