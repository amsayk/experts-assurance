import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { role as onRole } from 'redux/reducers/users/actions';

import { Role_ADMINISTRATORS, Role_AGENTS, Role_CLIENTS } from 'roles';

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
  id: Role_ADMINISTRATORS,
}, {
  displayName: 'Agents',
  id: Role_AGENTS,
}, {
  displayName: 'Clients',
  id: Role_CLIENTS,
}];

function Role({ displayName, active, onRole }) {
  return (
    <li className={style.roleItem}>
      <Button className={cx(style.roleButton, active && style.roleButtonActive)} onClick={onRole} role='button'>
        {displayName}
      </Button>
    </li>
  );
}

class Roles extends React.PureComponent {
  constructor() {
    super();

    this.onRole = this.onRole.bind(this);
  }
  onRole(role) {
    this.props.actions.onRole(role);
  }

  render() {
    const { role } = this.props;

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
              onRole={this.onRole.bind(this, id)}
              active={role ? id === role : typeof id === 'undefined'}
            />
          );
        })}
      </ul>
    );
  }
}

Roles.propTypes = {
  actions : T.shape({
    onRole: T.func.isRequired,
  }),
  intl    : intlShape.isRequired,
  role    : T.string.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators({
      onRole,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(Roles);

