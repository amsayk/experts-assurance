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
  CancelledIcon,
} from 'components/icons/MaterialIcons';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import selector from './selector';

function getState(state, stateText, icon) {
  return (
    <div className={style.state} style={{ marginRight: 5 }}>
      <span className={cx(style[state], style.docStateToggle)}>
        {icon}
      </span>
      <span className={style.text} style={{ textTransform: 'uppercase', marginLeft: 5 }}>
        {stateText}
      </span>
    </div>
  )
}

const STATES = {
  PENDING  : getState('PENDING',  'En cours', <UnknownIcon   size={18}/>),
  OPEN     : getState('OPEN',     'Validé',     <WatchIcon     size={18}/>),
  CLOSED   : getState('CLOSED',   'Clos',       <DoneIcon      size={18}/>),
  CANCELED : getState('CANCELED', 'Annulé',     <CancelledIcon size={18}/>),
};

class StateToggle extends React.Component {
  constructor() {
    super();

    this.onOpen = this.onOpen.bind(this);
  }
  onOpen(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onOpen();
  }
  render() {
    const { state } = this.props;

    return (
      <Button onClick={this.onOpen} className={cx(style.selectedStateButton, style.togglePickUser)} role='button'>
        {STATES[state]}
      </Button>
    );
  }
}
class StateChanger extends React.Component {
  onToggle() {
    this.setState(({ open }) => ({
      open : !open,
    }), () => {

    });
  }
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onToggle = this.onToggle.bind(this);

    this.state ={
      state : props.state,
      open  : false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.state !== nextProps.state) {
      this.setState({
        state : nextProps.state,
      });
    }
  }

  onSelect(state) {
    this.setState({
      state,
    });
  }

  render() {
    const { state } = this.state;
    const { actions } = this.props;
    return (
      <div className={style.filterGroup}>
        <div className={cx(this.state.open && style.mask)}></div>
        <Dropdown
          open={this.state.open}
          onToggle={this.onToggle}
          className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}

          onSelect={this.onSelect}
        >
          {state ? <StateToggle state={state} onOpen={this.onToggle}/> : <Dropdown.Toggle className={style.togglePickState} noCaret={false}>
            État
          </Dropdown.Toggle>}
          <Dropdown.Menu className={style.stateMenu}>
            <MenuItem eventKey='PENDING'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className={style['PENDING']}>
                  <UnknownIcon size={18}/>
                </div>
                <div style={{ marginLeft: 9 }}>
                  En cours
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
            <MenuItem eventKey='CANCELED'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className={style['CANCELED']}>
                  <CancelledIcon size={18}/>
                </div>
                <div style={{ marginLeft: 9 }}>
                  Annulé
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
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(StateChanger);

