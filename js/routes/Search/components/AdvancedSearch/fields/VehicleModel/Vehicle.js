import React from 'react';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import focusNode from 'focusNode';

import raf from 'requestAnimationFrame';

import style from 'routes/Search/styles';

import cx from 'classnames';

import SelectedVehicleToggle from './SelectedVehicleToggle';

import PickVehicle from './PickVehicle';

export default class Vehicle extends React.Component {
  state ={
    open : false,
  }
  constructor() {
    super();

    this.onToggle = this.onToggle.bind(this);
    this.onVehicle = this.onVehicle.bind(this);
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
  onVehicle(model) {
    this.props.onVehicle(model);
    this.setState({
      open : false,
    });
  }
  _onInput(input) {
    this._input = input;
  }
  render() {
    const { model, onVehicle } = this.props;
    return (
      <div className={style.advancedSearch_field}>
        <div className={style.advancedSearch_field_label}>
          Modèle
        </div>
        <div className={style.advancedSearch_field_info}>
          <div className={style.filterGroup}>
            <div className={cx(this.state.open && style.mask)}></div>
            <Dropdown
              open={this.state.open}
              onToggle={this.onToggle}
              className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
            >
              {model ? <SelectedVehicleToggle onClear={onVehicle} model={model}/> : <Dropdown.Toggle className={style.togglePickUser}>
                Filtre par modèle
              </Dropdown.Toggle>}
              <Dropdown.Menu className={style.userPickerMenu}>
                <MenuItem open={this.state.open} onInput={this._onInput} onVehicle={this.onVehicle} componentClass={PickVehicle}/>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

