import React from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import {
  CloseIcon,

  UnknownIcon,
  WatchIcon,
  DoneIcon,
  InvalidIcon,
} from 'components/icons/MaterialIcons';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import selector from './selector';

import { onState } from 'redux/reducers/cases/actions';

function getState(state, stateText, icon) {
  return (
    <div className={style.state} style={{ marginRight: 5 }}>
      <span className={style[state]}>
        {icon}
      </span>
      <span className={style.text} style={{ textTransform: 'uppercase', marginLeft: 5, marginTop: -2 }}>
        {stateText}
      </span>
    </div>
  )
}

const STATES = {
  PENDING : getState('PENDING', 'En attente',    <UnknownIcon size={18}/>),
  OPEN    : getState('OPEN',    'Validé',        <WatchIcon   size={18}/>),
  CLOSED  : getState('CLOSED',  'Clos',          <DoneIcon    size={18}/>),
  INVALID : getState('INVALID', 'Invalide',      <InvalidIcon size={18}/>),
};

class StateToggle extends React.Component {
  constructor() {
    super();

    this.onClear = this.onClear.bind(this);
  }
  onClear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClear();
  }
  render() {
    const { state } = this.props;

    return (
      <Button onClick={this.onClear} className={style.selectedUserButton} role='button'>
        {STATES[state]}
        <CloseIcon className={style.docStateCloseIcon} size={12}/>
      </Button>
    );
  }
}
class DocStateFilter extends React.Component {
  state ={
    open : false,
  }

  onToggle() {
    this.setState(({ open }) => ({
      open : !open,
    }), () => {

    });
  }
  constructor() {
    super();

    this.onSelect = this.onSelect.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  onSelect(state) {
    this.props.actions.onState(state);
  }

  render() {
    const { state, actions } = this.props;
    return (
      <div className={style.filterGroup}>
        <div className={cx(this.state.open && style.mask)}></div>
        <Dropdown
          open={this.state.open}
          onToggle={this.onToggle}
          className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}

          onSelect={this.onSelect}
        >
          {state ? <StateToggle state={state} onClear={this.onSelect}/> : <Dropdown.Toggle className={style.togglePickState} noCaret={false}>
            État
          </Dropdown.Toggle>}
          <Dropdown.Menu className={style.stateMenu}>
            <MenuItem eventKey='PENDING'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className={style['PENDING']}>
                  <UnknownIcon size={18}/>
                </div>
                <div style={{ marginLeft: 9 }}>
                  En attente
                </div>
              </div>
            </MenuItem>
            <MenuItem eventKey='OPEN'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className={style['OPEN']}>
                  <WatchIcon size={18}/>
                </div>
                <div style={{ marginLeft: 9 }}>
                  Validé
                </div>
              </div>
            </MenuItem>
            <MenuItem eventKey='CLOSED'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className={style['CLOSED']}>
                  <DoneIcon size={18}/>
                </div>
                <div style={{ marginLeft: 9 }}>
                  Clos
                </div>
              </div>
            </MenuItem>
            <MenuItem eventKey='INVALID'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className={style['INVALID']}>
                  <InvalidIcon size={18}/>
                </div>
                <div style={{ marginLeft: 9 }}>
                  Invalide
                </div>
              </div>
            </MenuItem>
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
  return {actions: bindActionCreators({ onState }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(DocStateFilter);

