import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import AppBrand from 'components/AppBrand';

import messages from '../../../messages';

import DataLoader from '../../../utils/DataLoader';

import style from '../../../ProductCatalog.scss';

import { injectIntl, intlShape } from 'react-intl';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
} from 'redux/reducers/catalog/constants';

import Alerts from 'containers/Alerts';

import ProductFormButton from './ProductFormButton';
import SearchBox from '../../../components/SearchBox';
import ViewTypeButton from './ViewTypeButton';
import SearchButton from '../../../components/SearchButton';
import SideMenuButton from './SideMenuButton';

import Actions from '../Actions';

import ProfileButton, { MenuItem as ProfileMenuItem } from 'components/Profile';

import {
  startAdding,
  stopAdding,
  toggleSearch,
  viewTypeGrid,
  viewTypeList,
  toggleSideMenu,
} from 'redux/reducers/catalog/actions';

import { toggleAlerts } from 'redux/reducers/app/actions';

import MenuItem from 'components/bootstrap/MenuItem';

import { PATH_SETTINGS_BASE } from 'vars';

import selector from './selector';

function Header({ intl, recent, user, onLogOut, catalog, app, actions }) {
  const { selection, searchOpen, sideMenuOpen, adding, viewType } = catalog;
  const { alertsOpen } = app;
  const {
    startAdding,
    stopAdding,
    viewTypeGrid,
    viewTypeList,
    toggleAlerts,
    toggleSearch,
    toggleSideMenu,
  } = actions;

  const menus = searchOpen ? [
    <SearchBox key='searchBox' recent={recent} intl={intl} onClose={toggleSearch}/>,
  ] : [
    <Actions key='actions'/>,
    <ViewTypeButton intl={intl} viewType={viewType} viewTypeList={viewTypeList} viewTypeGrid={viewTypeGrid}/>,
    <SearchButton key='searchButton' intl={intl} toggleSearch={toggleSearch}/>,
    <Alerts key='alerts' toggleAlerts={toggleAlerts} intl={intl} alertsOpen={alertsOpen}/>,
    <ProfileButton key='userProfile' user={user}>
      <MenuItem componentClass={ProfileMenuItem} user={user}/>
      <MenuItem componentClass={Link} to={PATH_SETTINGS_BASE}>
        {intl.formatMessage(messages.manageAccount)}
      </MenuItem>
      <MenuItem divider/>
      <MenuItem onClick={actions.logOut}>
        {intl.formatMessage(messages.logOut)}
      </MenuItem>
    </ProfileButton>,
  ];

  return (
    <nav data-root-close-ignore className={style.navbar}>
      <div className={style.leftNav}>
        <SideMenuButton open={sideMenuOpen} toggleSideMenu={toggleSideMenu}/>
        <ProductFormButton
          intl={intl}
          startAdding={startAdding}
          stopAdding={stopAdding}
          adding={adding} />
      </div>

      <div className={style.middleNav}>
        <AppBrand/>
      </div>

      <div className={style.rightNav}>
        {menus}
      </div>
    </nav>
  );
}

Header.propTypes = {
  intl     : intlShape.isRequired,
  onLogOut : T.func.isRequired,
  user: T.shape({
    displayName: T.string.isRequired,
    email: T.string.isRequired,
  }),
  catalog  : T.shape({
    searchOpen: T.bool.isRequired,
    adding: T.bool.isRequired,
    viewType: T.oneOf([
      VIEW_TYPE_LIST,
      VIEW_TYPE_GRID,
    ]).isRequired,
  }),
  app  : T.shape({
    alertsOpen: T.bool.isRequired,
    isReady: T.bool.isRequired,
  }),

};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      stopAdding,
      startAdding,
      viewTypeList,
      viewTypeGrid,
      toggleSearch,
      toggleAlerts,
      toggleSideMenu,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
  DataLoader.catalogRecent,
)(Header);

