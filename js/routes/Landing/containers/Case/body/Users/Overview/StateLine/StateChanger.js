import React from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import {
  CloseIcon,

  // UnknownIcon,
  ThumbsUpIcon,
  WatchIcon,
  DoneIcon,
  CanceledIcon,
} from 'components/icons/MaterialIcons';

import { toastr } from 'containers/Toastr';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import selector from './selector';

const CONFIRM_MSG = <div style={style.confirmToastr}>
  <h5>Êtes-vous sûr?</h5>
  </div>;

function getState(state, stateText, icon) {
  return (
    <div className={style.state} style={{ marginRight: 5 }}>
      <span className={cx(style[state === 'VALID' ? 'OPEN' : state], style.docStateToggle)}>
        {icon}
      </span>
      <span className={style.text} style={{ textTransform: 'uppercase', marginLeft: 5 }}>
        {stateText}
      </span>
    </div>
  )
}

const STATE_COMPONENT = {
  // PENDING  : getState('PENDING',  'En attente', <UnknownIcon   size={18}/>),
  OPEN     : getState('OPEN',     'En cours',   <WatchIcon     size={18}/>),
  VALID    : getState('VALID',    'Validé',     <ThumbsUpIcon  size={18}/>),
  CLOSED   : getState('CLOSED',   'Clos',       <DoneIcon      size={18}/>),
  CANCELED : getState('CANCELED', 'Annulé',     <CanceledIcon  size={18}/>),
};

const STATE_MENUITEM = {
  // PENDING  : <MenuItem eventKey='PENDING'>
  //   <div style={{ display: 'flex', flexDirection: 'row' }}>
  //     <div className={style['PENDING']}>
  //       <UnknownIcon size={18}/>
  //     </div>
  //     <div style={{ marginLeft: 9 }}>
  //       En attente
  //     </div>
  //   </div>
  // </MenuItem>,
  OPEN     : <MenuItem eventKey='OPEN'>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className={style['OPEN']}>
        <WatchIcon size={18}/>
      </div>
      <div style={{ marginLeft: 9 }}>
        En cours
      </div>
    </div>
  </MenuItem>,
  CLOSED   : <MenuItem eventKey='CLOSED'>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className={style['CLOSED']}>
        <DoneIcon size={18}/>
      </div>
      <div style={{ marginLeft: 9 }}>
        Clos
      </div>
    </div>
  </MenuItem>,
  CANCELED : <MenuItem eventKey='CANCELED'>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className={style['CANCELED']}>
        <CanceledIcon size={18}/>
      </div>
      <div style={{ marginLeft: 9 }}>
        Annulé
      </div>
    </div>
  </MenuItem>,
};

const STATE_LEVEL = {
  // PENDING  : 1,
  OPEN     : 2,
  CLOSED   : 3,
  CANCELED : 3,
};

const STATES = Object.keys(STATE_MENUITEM);

class StateToggle extends React.Component {
  render() {
    const { doc, state } = this.props;

    let _state = state;

    if (state === 'OPEN' && doc && doc.validation && doc.validation.date && doc.validation.amount !== null) {
      _state = 'VALID';
    }

    return (
      <Button className={cx(style.selectedStateButton, style.togglePickUser)} style={{cursor: 'default'}}>
        {STATE_COMPONENT[_state]}
      </Button>
    );

  }
}
class StateChanger extends React.Component {
  onToggle() {
    this.setState(({ open, state }, { deletion }) => ({
      open : deletion || state === 'CLOSED' || state === 'CANCELED' ? false : !open,
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
      keys  : STATES.filter((key) => STATE_LEVEL[key] > STATE_LEVEL[props.state]),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.state !== nextProps.state) {
      this.setState({
        state : nextProps.state,
        keys  : STATES.filter((key) => STATE_LEVEL[key] > STATE_LEVEL[nextProps.state]),
      });
    }
  }

  onSelect(state) {
    const self = this;
    if (!self.state.busy) {
      toastr.confirm(CONFIRM_MSG, {
        cancelText : 'Non',
        okText     : 'Oui',
        onOk       : () => {
          self.setState({
            state,
          });
          self.props.onStateChange(state);
        },
      });
    }

  }

  render() {
    const { keys, state } = this.state;
    const { busy, doc, actions } = this.props;
    return (
      <div className={style.filterGroup}>
        <div
          className={cx(style.pickUserDropdown)}
        >
          <StateToggle doc={doc} state={state}/>
        </div>
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

