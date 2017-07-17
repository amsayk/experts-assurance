import React from 'react';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import focusNode from 'focusNode';

import raf from 'utils/requestAnimationFrame';

import style from 'routes/Search/styles';

import cx from 'classnames';

import { Role_ADMINISTRATORS, Role_MANAGERS } from 'roles';

import PickCompany from './PickCompany';

import SelectedCompanyToggle from './SelectedCompanyToggle';

export default class Company extends React.Component {
  state ={
    open : false,
  }
  constructor() {
    super();

    this.onToggle = this.onToggle.bind(this);
    this.onCompany = this.onCompany.bind(this);
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
  onCompany(s) {
    this.props.onCompany(s);
    this.setState({
      open : false,
    });
  }
  _onInput(input) {
    this._input = input;
  }
  render() {
    const { company, onCompany } = this.props;
    return (
      <div className={style.advancedSearch_field}>
        <div className={style.advancedSearch_field_label}>
          Compagnie
        </div>
        <div className={style.advancedSearch_field_info}>
          <div className={style.filterGroup}>
            <div className={cx(this.state.open && style.mask)}></div>
            <Dropdown
              open={this.state.open}
              onToggle={this.onToggle}
              className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
            >
              {company ? <SelectedCompanyToggle onClear={onCompany} company={company}/> : <Dropdown.Toggle className={style.togglePickUser}>
                Filtre par une compagnie
              </Dropdown.Toggle>}
              <Dropdown.Menu className={style.userPickerMenu}>
                <MenuItem
                  open={this.state.open}
                  onInput={this._onInput}
                  onCompany={this.onCompany}
                  componentClass={PickCompany}/>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

