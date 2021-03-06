import React from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from 'react-intl';

import style from 'routes/Settings/styles';

import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

import { logOut } from 'redux/reducers/user/actions';

import selector from './selector';

import messages from 'routes/Settings/messages';

import Title from 'components/Title';

import { APP_NAME } from 'vars';

import ChangePasswordForm from './ChangePasswordForm';

function ChangePasswordContainer({ intl, user, actions }) {
  return (
    <div className={style.root}>
      <Title title={intl.formatMessage(messages.title, { appName: APP_NAME })} />
      <Header
        danger={
          user && user.changePasswordAtNextLogin
            ? intl.formatMessage(messages.changePasswordAtNextLogin)
            : null
        }
        onLogOut={actions.logOut}
      />
      {/* <div className={style.body}> */}
      <Sidebar user={user} selectedMenuItem={'security.change_password'} />
      <ChangePasswordForm intl={intl} />
      {/* </div> */}
    </div>
  );
}

ChangePasswordContainer.propTypes = {
  intl: intlShape.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ logOut }, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, Connect)(ChangePasswordContainer);
