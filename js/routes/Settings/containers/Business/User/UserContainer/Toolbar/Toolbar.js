import React from 'react';
import T from 'prop-types';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AppBrand from 'components/AppBrand';

import messages from 'routes/Settings/messages';

import style from 'routes/Settings/styles';

import { injectIntl, intlShape } from 'react-intl';

import Actions from './Actions';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USERS } from 'vars';

import ProfilePic from 'components/Profile/ProfilePic';

import { VIEW_TYPE_GRID, VIEW_TYPE_LIST } from 'redux/reducers/users/constants';

import SearchBox from 'routes/Settings/containers/Business/Users/UsersContainer/Toolbar/Search/SearchBox';
import SearchButton from 'routes/Settings/containers/Business/Users/UsersContainer/Toolbar/Search/SearchButton';

import { NavLeftIcon } from 'components/icons/MaterialIcons';

import { search, toggleSearch } from 'redux/reducers/users/actions';

import MenuItem from 'components/bootstrap/MenuItem';

import selector from './selector';

const NAVBAR_HEIGHT = 61;
const NOTIFICATION_HEIGHT = 45;

const DEFAULT_TOP = NAVBAR_HEIGHT;

const getStyle = (notificationOpen, scrollTop) =>
  notificationOpen
    ? {
        top: scrollTop === 0 ? DEFAULT_TOP + NOTIFICATION_HEIGHT : DEFAULT_TOP,
      }
    : {};

class Toolbar extends React.Component {
  componentDidMount() {
    if (this.props.searchOpen) {
      this.props.actions.toggleSearch();
      this.props.actions.search('');
    }
  }
  render() {
    const {
      intl,
      user,
      currentUser,
      searchOpen,
      scrolling,
      notificationOpen,
      actions,
    } = this.props;
    const { toggleSearch } = actions;

    const menus = searchOpen
      ? [<SearchBox key='searchBox' intl={intl} onClose={toggleSearch} />]
      : [
          <Actions currentUser={currentUser} user={user} key='actions' />,
          <SearchButton
            key='searchButton'
            intl={intl}
            toggleSearch={toggleSearch}
          />,
        ];

    return (
      <nav
        data-root-close-ignore
        style={getStyle(notificationOpen, scrolling.scrollTop)}
        className={style.toolbar}
      >
        <div className={style.toolbarLeft}>
          <div className={style.back}>
            <Link
              to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USERS}
              className={style.backButton}
            >
              <NavLeftIcon size={24} />
              <div className={style.backText}>Utilisateurs</div>
            </Link>
          </div>
        </div>

        <div className={style.toolbarMiddle}>
          <ProfilePic user={user} />
        </div>

        <div className={style.toolbarRight}>
          {menus}
        </div>
      </nav>
    );
  }
}

Toolbar.propTypes = {
  intl: intlShape.isRequired,
  searchOpen: T.bool.isRequired,
  selectedUser: T.shape({}),
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        search,
        toggleSearch,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, Connect)(Toolbar);
