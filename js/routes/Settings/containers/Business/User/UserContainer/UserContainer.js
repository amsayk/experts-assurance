import React from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from 'react-intl';

import { logOut } from 'redux/reducers/user/actions';

import selector from './selector';

import style from 'routes/Settings/styles';

import cx from 'classnames';

import Header from 'routes/Settings/components/Header';
import Sidebar from 'routes/Settings/components/Sidebar';

import DataLoader from 'routes/Settings/containers/Business/User/DataLoader';

import messages from 'routes/Settings/messages';

import Title from 'components/Title';

import { APP_NAME } from 'vars';

import Toolbar from './Toolbar';

import Overview from './info/Overview';

import Nav from './Nav';

function UserContainer({ intl, user, loading, selectedUser, notificationOpen, actions }) {
  return (
    <div className={cx(style.root, notificationOpen && style.notificationOpen)}>
      <Title title={intl.formatMessage(messages.title, { appName: APP_NAME })}/>
      <Header onLogOut={actions.logOut}/>
      <div className={style.body}>
        <Sidebar user={user} selectedMenuItem={'business.users'}/>
        <div className={style.userContainer}>
          <Toolbar currentUser={user} user={selectedUser}/>
          <Nav user={selectedUser} selectedNavItem={'user.overview'}/>
          <Overview intl={intl} currentUser={user} user={selectedUser} loading={loading}/>
        </div>
      </div>
    </div>
  );
}

UserContainer.propTypes = {
  intl : intlShape.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ logOut }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
  DataLoader.user,
)(UserContainer);

