import React from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import focusNode from 'focusNode';

import raf from 'requestAnimationFrame';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import selector from './selector';

import { onInsurer, search } from 'redux/reducers/cases/actions';

import SelectedUserToggle from '../SelectedUserToggle';

import { Role_ADMINISTRATORS, Role_AGENTS } from 'roles';

import createUserPicker from '../PickUser';

const PickUser = createUserPicker(Role_ADMINISTRATORS, Role_AGENTS);

class InsurerFilter extends React.Component {
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
        this.props.actions.search('');
      } else {
        raf(() => focusNode(this._input));
      }
    });
  }
  onUser(id) {
    this.props.actions.onInsurer(id);
    this.setState({
      open : false,
    }, () => this.props.actions.search(''))
  }
  _onInput(input) {
    this._input = input;
  }
  render() {
    const { user, insurer, actions } = this.props;
    return (
      <div className={style.filterGroup}>
        <div className={cx(this.state.open && style.mask)}></div>
        <Dropdown
          open={this.state.open}
          onToggle={this.onToggle}
          className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
        >
          {insurer ? <SelectedUserToggle onClear={actions.onInsurer} id={insurer}/> : <Dropdown.Toggle className={style.togglePickUser} noCaret={false}>
            Agent
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
  return {actions: bindActionCreators({ onInsurer, search }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(InsurerFilter);

