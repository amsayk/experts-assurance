import React from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from 'react-intl';

import { logOut } from 'redux/reducers/user/actions';

import { VIEW_TYPE_LIST } from 'redux/reducers/users/constants';

import selector from './selector';

import style from 'routes/Settings/styles';

import Header from 'routes/Settings/components/Header';
import Sidebar from 'routes/Settings/components/Sidebar';

import cx from 'classnames';

import messages from 'routes/Settings/messages';

import Title from 'components/Title';

import { APP_NAME, COUNTRY } from 'vars';

import Grid from './Grid';
import List from './List';

function UsersContainer({ intl, user, viewType, actions }) {
  const isList = viewType === VIEW_TYPE_LIST;
  return (
    <div className={cx(style.root, isList && style.listView)}>
      <Title title={intl.formatMessage(messages.title, { appName: APP_NAME })}/>
      <Header onLogOut={actions.logOut}/>
      <div className={style.body}>
        <Sidebar user={user} selectedMenuItem={'business.users'}/>
        {isList ? <List/> : <Grid/>}
      </div>
    </div>
  );
}

UsersContainer.propTypes = {
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
)(UsersContainer);

