import React from 'react';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import focusNode from 'focusNode';

import raf from 'utils/requestAnimationFrame';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import SelectedUserToggle from './SelectedUserToggle';

import { Role_ADMINISTRATORS, Role_MANAGERS } from 'roles';

import { toastr } from 'containers/Toastr';

import createUserPicker from './PickManager';

const PickManager = createUserPicker(Role_ADMINISTRATORS, Role_MANAGERS);

const CONFIRM_MSG = <div style={style.confirmToastr}>
  <h5>Êtes-vous sûr?</h5>
</div>;

class ManagerChanger extends React.Component {
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
    this.setState(({ open }, { doc }) => ({
      open : doc.deletion || doc.state === 'CLOSED' || doc.state === 'CANCELED' ? false : !open,
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
    const self = this;
    if (!self.state.busy) {
      toastr.confirm(CONFIRM_MSG, {
        cancelText : 'Non',
        okText     : 'Oui',
        onOk       : () => {
          const id = self.state.selectedUserId;
          self.setState({
            open : false,
            selecteduserid : null,
            querystring : '',
          });
          self.props.onSetManager(id);
        },
      });
    }
  }
  _onInput(input) {
    this._input = input;
  }
  render() {
    const { busy, doc, manager, actions } = this.props;
    return (
      <div className={style.filterGroup}>
        <div className={cx(this.state.open && style.mask)}></div>
        <Dropdown
          open={this.state.open}
          onToggle={this.onToggle}
          className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
        >
          <SelectedUserToggle onOpen={this.onToggle} doc={doc} user={manager}/>
          {doc.deletion || doc.state === 'CLOSED' || doc.state === 'CANCELED' ? <Dropdown.Menu/> : <Dropdown.Menu className={style.userPickerMenu}>
            <MenuItem
              onAction={this.onAction}
              queryString={this.state.queryString}
              selectedUserId={this.state.selectedUserId}
              open={this.state.open}
              onInput={this._onInput}
              onUser={this.onUser}
              onSearch={this.onSearch}
              componentClass={PickManager}
            />
          </Dropdown.Menu>}
        </Dropdown>
      </div>
    );
  }
}

export default ManagerChanger;

