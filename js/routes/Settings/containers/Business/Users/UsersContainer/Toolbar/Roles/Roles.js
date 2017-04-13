import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { roles as onRoles } from 'redux/reducers/users/actions';

import { Role_ADMINISTRATORS, Role_MANAGERS, Role_AGENTS, Role_CLIENTS } from 'roles';

import cx from 'classnames';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import {
  RefreshIcon,
  MoreVertIcon,
} from 'components/icons/MaterialIcons';

import Tooltip from 'components/react-components/Tooltip';

import style from 'routes/Settings/styles';

import selector from './selector';

import { injectIntl, intlShape } from 'react-intl';

const tooltipAlign = {
  offset: [0, -4],
};

const ROLES = [{
  displayName: 'Tous',
}, {
  displayName: 'Admins',
  id: [Role_ADMINISTRATORS],
}, {
  displayName: 'Gestionaires',
  id: [Role_MANAGERS],
}, {
  displayName: 'Tiers',
  id: [Role_AGENTS, Role_CLIENTS],
}];

function Role({ displayName, active, onRoles }) {
  return (
    <li className={style.roleItem}>
      <Button className={cx(style.roleButton, active && style.roleButtonActive)} onClick={onRoles} role='button'>
        {displayName}
      </Button>
    </li>
  );
}

class Roles extends React.PureComponent {
  constructor() {
    super();

    this.onRoles = this.onRoles.bind(this);
  }
  onRoles(roles) {
    this.props.actions.onRoles(roles);
  }

  render() {
    const { roles } = this.props;

    return (
      <ul className={style.roles}>
        <li className={style.roleItem}>
          <div className={style.roleItemIntro}>
            Filtrer:
          </div>
        </li>
        {ROLES.map(({ displayName, id }, index) => {
          return (
            <Role
              displayName={displayName}
              key={index}
              onRoles={this.onRoles.bind(this, id)}
              active={Array.isArray(id) ? id.every((elem) => roles.indexOf(elem) > -1) : roles.length === 0}
            />
          );
        })}
      </ul>
    );
  }
}

Roles.propTypes = {
  actions : T.shape({
    onRoles: T.func.isRequired,
  }),
  intl    : intlShape.isRequired,
  roles    : T.arrayOf(T.string.isRequired).isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators({
      onRoles,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(Roles);

