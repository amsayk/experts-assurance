import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import AppBrand from 'components/AppBrand';

import messages from 'routes/Settings/messages';

import DataLoader from 'routes/Settings/containers/Business/Users/DataLoader';

import style from 'routes/Settings/styles';

import { injectIntl, intlShape } from 'react-intl';

import Actions from './Actions';
import Roles from './Roles';
import PageInfo from './PageInfo';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
} from 'redux/reducers/users/constants';

import SearchBox from './Search/SearchBox';
import ViewTypeButton from './ViewTypeButton';
import SearchButton from './Search/SearchButton';

import {
  toggleSearch,
  viewTypeGrid,
  viewTypeList,
} from 'redux/reducers/users/actions';

import MenuItem from 'components/bootstrap/MenuItem';

import selector from './selector';

const NAVBAR_HEIGHT = 61;
const NOTIFICATION_HEIGHT = 45;

const DEFAULT_TOP = NAVBAR_HEIGHT;

const getStyle = (notificationOpen, scrollTop) => notificationOpen ? ({
  top : scrollTop === 0 ? DEFAULT_TOP + NOTIFICATION_HEIGHT : DEFAULT_TOP,
  ...(scrollTop === 0 ? {} : { boxShadow: '0 2px 4px 0 #e6e9ed' }),
}) : ({
  ...(scrollTop === 0 ? {} : { boxShadow: '0 2px 4px 0 #e6e9ed' }),
});

function Toolbar({ intl, cursor, length, user, loading, users, scrolling, notificationOpen, actions }) {
  const { searchOpen, viewType } = users;
  const {
    viewTypeGrid,
    viewTypeList,
    toggleSearch,
  } = actions;

  const menus = searchOpen ? [
    <SearchBox key='searchBox' intl={intl} onClose={toggleSearch}/>,
  ] : [
    <Actions key='actions'/>,
    <ViewTypeButton intl={intl} viewType={viewType} viewTypeList={viewTypeList} viewTypeGrid={viewTypeGrid}/>,
    <SearchButton key='searchButton' intl={intl} toggleSearch={toggleSearch}/>,
  ];

  return (
    <nav data-root-close-ignore style={getStyle(notificationOpen, scrolling.scrollTop)} className={style.toolbar}>
      <div className={style.toolbarLeft}>
        <Roles/>
      </div>

      <div className={style.toolbarMiddle}>
        <PageInfo cursor={cursor} length={length}/>
      </div>

      <div className={style.toolbarRight}>
        {menus}
      </div>
    </nav>
  );
}

Toolbar.propTypes = {
  intl     : intlShape.isRequired,
  users  : T.shape({
    searchOpen: T.bool.isRequired,
    viewType: T.oneOf([
      VIEW_TYPE_LIST,
      VIEW_TYPE_GRID,
    ]).isRequired,
  }),

};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      viewTypeList,
      viewTypeGrid,
      toggleSearch,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(Toolbar);

