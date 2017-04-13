import React, { PropTypes as T } from 'react';
import { Link, withRouter } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import messages from 'routes/Search/messages';

import style from 'routes/Search/styles';

import { injectIntl, intlShape } from 'react-intl';

import Alerts from 'containers/Alerts';

import emptyObject from 'emptyObject';

import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import Tooltip from 'components/react-components/Tooltip';

import { BackIcon } from 'components/icons/MaterialIcons';

import { PATH_SETTINGS_BASE } from 'vars';

import ProfileButton, { MenuItem as ProfileMenuItem } from 'components/Profile';

import { toggleAlerts } from 'redux/reducers/app/actions';

import SearchBox from './SearchBox';
import Actions from './Actions';

import selector from './selector';

const tooltipAlign = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

const styles = {
  show: (notificationOpen, scrollTop) => ({
    top : notificationOpen && scrollTop === 0 ? NOTIFICATION_HEIGHT : 0,
  }),
};

const MIN_HEIGHT = 200;
const MIN_SCROLL_UP_DELTA = 18.5;

const NOTIFICATION_HEIGHT = 45;

class Header extends React.Component {
  state = {
    show : true,
  };

  componentWillReceiveProps(nextProps) {
    const { scrollTop, lastScrollTop } = nextProps.scrolling;
    if (this.props.scrolling.scrollTop !== scrollTop || this.props.scrolling.lastScrollTop !== lastScrollTop) {
      if (scrollTop > lastScrollTop){
        // downscroll code
        if (scrollTop >= MIN_HEIGHT && this.state.show === true) {
          this.setState({
            show : false,
          });
        }
      } else {
        // upscroll code
        if (Math.abs(lastScrollTop - scrollTop) >= MIN_SCROLL_UP_DELTA && this.state.show === false) {
          this.setState({
            show : true,
          });
        }
      }
    }
  }
  constructor(props) {
    super(props);

    this.onBack = this.onBack.bind(this);
  }

  onBack() {
    this.props.router.goBack();
  }
  render() {
    const {
      length,
      notificationOpen,
      searching,
      scrolling,
      intl,
      user,
      onLogOut,
      app,
      actions,
    } = this.props;
    return (
      <nav style={this.state.show || searching ? styles.show(notificationOpen, scrolling.scrollTop) : emptyObject} className={style.navbar}>
        <div className={style.leftNav}>
          <Tooltip align={tooltipAlign} overlay={'Retour'}>
            <Button onClick={this.onBack} className={style.backButton} role={'button'}>
              <BackIcon size={28}/>
            </Button>
          </Tooltip>
        </div>

        <div className={style.middleNav}>
          <SearchBox/>
        </div>

        <div className={style.rightNav}>
          <Actions length={length} />
          <Alerts toggleAlerts={actions.toggleAlerts} intl={intl} alertsOpen={app.alertsOpen}/>
          <ProfileButton user={user}>
            <MenuItem componentClass={ProfileMenuItem} user={user}/>
            <MenuItem componentClass={Link} to={PATH_SETTINGS_BASE}>
              {intl.formatMessage(messages.manageAccount)}
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

