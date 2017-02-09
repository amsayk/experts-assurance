import React, { PropTypes as T } from 'react';
import { Link, withRouter } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import messages from '../../messages';

import style from '../../Search.scss';

import { injectIntl, intlShape } from 'react-intl';

import Alerts from 'containers/Alerts';

import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import Tooltip from 'components/react-components/Tooltip';

import { BackIcon } from 'components/icons/MaterialIcons';

import { PATH_SETTINGS_BASE, PATH_PRODUCT_CATALOG_BASE } from 'vars';

import ProfileButton, { MenuItem as ProfileMenuItem } from 'components/Profile';

import { toggleAlerts } from 'redux/reducers/app/actions';

import SearchBox from './SearchBox';

import selector from './selector';

const tooltipAlign = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.onBack = this.onBack.bind(this);
  }

  onBack() {
    this.props.router.goBack();
  }
  render() {
    const { intl, user, onLogOut, app, actions } = this.props;
    return (
      <nav className={style.navbar}>
        <div className={style.leftNav}>
          <Tooltip align={tooltipAlign} overlay={'Back'}>
          <Button onClick={this.onBack} className={style.backButton} role={'button'}>
              <BackIcon size={32}/>
          </Button>
        </Tooltip>
        </div>

        <div className={style.middleNav}>
          <SearchBox/>
        </div>

        <div className={style.rightNav}>
          <Alerts toggleAlerts={actions.toggleAlerts} intl={intl} alertsOpen={app.alertsOpen}/>
          <ProfileButton user={user}>
            <MenuItem componentClass={ProfileMenuItem} user={user}/>
            <MenuItem componentClass={Link} to={PATH_SETTINGS_BASE}>
              {intl.formatMessage(messages.manageAccount)}
            </MenuItem>
            <MenuItem divider/>
            <MenuItem componentClass={Link} to={PATH_PRODUCT_CATALOG_BASE}>
              {intl.formatMessage(messages.productCatalog)}
            </MenuItem>
            <MenuItem divider/>
            <MenuItem onClick={onLogOut}>
              {intl.formatMessage(messages.logOut)}
            </MenuItem>
          </ProfileButton>
        </div>

      </nav>
    );
  }

}

Header.propTypes = {
  intl     : intlShape.isRequired,
  onLogOut : T.func.isRequired,
  user: T.shape({
    displayName: T.string.isRequired,
    email: T.string.isRequired,
  }),
  app  : T.shape({
    alertsOpen: T.bool.isRequired,
  }),

};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      toggleAlerts,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withRouter,
  injectIntl,
  Connect,
)(Header);

