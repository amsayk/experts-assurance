import React from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import selector from './selector';

import { MoreHorizIcon } from 'components/icons/MaterialIcons';

class Actions extends React.Component {
  state ={
    open : false,
  };
  constructor() {
    super();

    this.onToggle = this.onToggle.bind(this);
    this.onAction = this.onAction.bind(this);
  }
  onToggle() {
    this.setState(({ open }) => ({
      open : !open,
    }));
  }

  onAction() {
  }

  render() {
    const { user, hasSelection } = this.props;

    if (!hasSelection) {
      return null;
    }

    return (
      <div className={style.filterGroup}>
        <div className={cx(this.state.open && style.mask)}></div>
        <Dropdown
          open={this.state.open}
          onToggle={this.onToggle}
          className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
        >
          <Dropdown.Toggle className={style.actionsMenuToggle}>
            <MoreHorizIcon size={24}/>
          </Dropdown.Toggle>
          <Dropdown.Menu className={style.actionsMenu}>
            <MenuItem>Changer l'état</MenuItem>
            <MenuItem>Archiver</MenuItem>
            {user.isAdmin ? [
              <MenuItem divider/>,
              <MenuItem>Supprimer</MenuItem>
            ] : null}
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
  return {
    actions: bindActionCreators({
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(Actions);

