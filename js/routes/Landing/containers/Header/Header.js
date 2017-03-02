import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { reduxForm, Field } from 'redux-form/immutable';

import AppBrand from 'components/AppBrand';

import messages from '../../messages';

import style from 'routes/Landing/styles';

import { injectIntl, intlShape } from 'react-intl';

import Alerts from 'containers/Alerts';

import Tooltip from 'components/react-components/Tooltip';

import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import { PATH_SETTINGS_BASE, PATH_CASES } from 'vars';

import ProfileButton, { MenuItem as ProfileMenuItem } from 'components/Profile';

import SearchBox from './SearchBox';

import { PlusIcon, NavLeftIcon } from 'components/icons/MaterialIcons';

import addEventListener from 'utils/lib/DOM/addEventListener';

import {
  toggleAlerts,
} from 'redux/reducers/app/actions';

import selector from './selector';

import emptyObject from 'emptyObject';

const tooltipAlign = {
  offset: [10, -4],
};

const styles = {
  hide: {
    top: -70,
  },
};

const MIN_HEIGHT = 200;
const MIN_SCROLL_UP_DELTA = 18.5;

class Header extends React.Component {
  lastScrollTop = 0;
  state = {
    show : true,
  };
  constructor() {
    super();

    this._handleScroll = this._handleScroll.bind(this);
  }
  _unregisterEventHandlers() {
    if (this._eventHandler) {
      this._eventHandler.remove();
      this._eventHandler = null;
    }

  }
  _registerEventHandlers() {
    this._eventHandler = addEventListener(document, 'scroll', this._handleScroll);
  }
  componentDidMount() {
    this._registerEventHandlers();
  }

  componentWillUnmount() {
    this._unregisterEventHandlers();
  }

  _handleScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: 'https://github.com/qeremy/so/blob/master/so.dom.js#L426'
    if (st > this.lastScrollTop){
      // downscroll code
      if (st >= MIN_HEIGHT && this.state.show === true) {
        this.setState({
          show : false,
        });
      }
    } else {
      // upscroll code
      if (Math.abs(this.lastScrollTop - st) >= MIN_SCROLL_UP_DELTA && this.state.show === false) {
        this.setState({
          show : true,
        });
      }
    }
    this.lastScrollTop = st;
  }
  render() {
    const { id, searching, intl, user, onLogOut, app, actions } = this.props;
    const isEmployee = user && user.isAdminOrAgent;
    return (
      <nav style={this.state.show || searching ? emptyObject : styles.hide} className={style.navbar}>
        <div className={style.leftNav}>
          {id ? <div className={style.back}>
            <Link className={style.backButton} to={PATH_CASES}>
              <Tooltip placement='bottomLeft' align={tooltipAlign} overlay={'Rétour aux dossiers'}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NavLeftIcon size={36}/>
                </div>
              </Tooltip>
            </Link>
          </div> : null}
          <AppBrand/>
        </div>

        <div className={style.middleNav}>
          <Field
            name='search'
            component={SearchBox}
          />
        </div>

        <div className={style.rightNav}>
          {isEmployee ? [
            <Button className={style.buyButton}>
              <div>
                <PlusIcon size={32} />
                <span>
                  Nouveau Dossier
                </span>
              </div>
            </Button>,
            <Alerts toggleAlerts={actions.toggleAlerts} intl={intl} alertsOpen={app.alertsOpen}/>,
          ]: null}
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

const Form = reduxForm({
  form : 'globalSearch',
});

export default compose(
  injectIntl,
  Connect,
  Form,
)(Header);

