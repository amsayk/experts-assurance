import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from 'react-intl';

import { logOut } from 'redux/reducers/user/actions';

import selector from './selector';

import style from '../../../Settings.scss';

import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

import messages from '../../../messages';

import Title from 'components/Title';

import QUERY from './currentUser.query.graphql';

import { APP_NAME } from 'vars';

import ChangeEmailForm from './ChangeEmailForm';

function ChangeEmailContainer({ intl, data: { loading, currentUser }, actions }) {
  return (
    <div className={style.root}>
      <Title title={intl.formatMessage(messages.title, { appName: APP_NAME })}/>
      <Header onLogOut={actions.logOut}/>
      <div className={style.body}>
        <Sidebar selectedMenuItem={'account.change_email'}/>
        {loading ? null : <ChangeEmailForm intl={intl} user={currentUser}/>}
      </div>
    </div>
  );
}

ChangeEmailContainer.propTypes = {
  intl: intlShape.isRequired,
  data: T.shape({
    loading: T.bool.isRequired,
    currentUser: T.object,
  }).isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ logOut }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

const withCurrentUser = graphql(QUERY, {
  options: ({ user }) => ({ variables: { id: user.get('id') } }),
  skip: ({ user }) => user.isEmpty(),
});

export default compose(
  injectIntl,
  Connect,
  withCurrentUser,
)(ChangeEmailContainer);

