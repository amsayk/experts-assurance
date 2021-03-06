import React from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import focusNode from 'focusNode';

import raf from 'utils/requestAnimationFrame';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import style from 'routes/Landing/styles';

import selector from './selector';

import { onClient, search } from 'redux/reducers/cases/actions';

import SelectedUserToggle from '../SelectedUserToggle';

import { Role_CLIENTS } from 'roles';

import cx from 'classnames';

import createUserPicker from '../PickUser';

const PickUser = createUserPicker(Role_CLIENTS);

class ClientFilter extends React.Component {
  state ={
    open : false,
  }
  constructor() {
    super();

    this.onToggle = this.onToggle.bind(this);
    this.onUser = this.onUser.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this._onInput = this._onInput.bind(this);
  }
  onToggle() {
    this.setState(({ open }) => ({
      open : !open,
    }), () => {
      if (!this.state.open) {
        this.props.actions.search('');
      } else {
        raf(() => focusNode(this._input));
      }
    });
  }
  onOpen() {
    this.setState({
      open : true,
    }, () => {
      raf(() => focusNode(this._input));
    });
  }
  onUser(id) {
    this.props.actions.onClient(id);
    this.setState({
      open : false,
    }, () => this.props.actions.search(''))
  }
  _onInput(input) {
    this._input = input;
  }
  render() {
    const { user, client, actions } = this.props;
    return (
      <div className={style.filterGroup}>
        <div className={cx(this.state.open && style.mask)}></div>
        <Dropdown
          open={this.state.open}
          onToggle={this.onToggle}
          className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
        >
          {client ? <SelectedUserToggle onOpen={this.onOpen} onClear={actions.onClient} id={client}/> : <Dropdown.Toggle className={style.togglePickUser}>
            Assuré
          </Dropdown.Toggle>}
          <Dropdown.Menu className={style.userPickerMenu}>
            <MenuItem open={this.state.open} onInput={this._onInput} onUser={this.onUser} componentClass={PickUser}/>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }

}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ onClient, search }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(ClientFilter);

