import React, { PropTypes as T } from 'react';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { APP_NAME } from 'vars';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Authorization/Authorization.scss';

import Header from '../Header';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import messages from 'routes/Authorization/messages';

import selector from './selector';

export class AuthorizationContainer extends React.PureComponent {
  render() {
    const { intl, user, className, actions } = this.props;
    return (
      <div className={style.root}>
        <Header user={user} onLogOut={actions.logOut}/>
        <div className={style.center}>
          <p className={style.infoLine}>
            <h3>
              <FormattedMessage
                {...messages.Thanks}
                values={{
                  appName: <strong>{APP_NAME}</strong>,
                }}
              />
            </h3>
          </p>
          <p className={style.infoLine}>
            <FormattedMessage
              {...messages.AuthorizationPending}
              values={{
              }}
            />
          </p>
        </div>
      </div>
    );
  }
}

AuthorizationContainer.propTypes = {
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

export default compose(
  injectIntl,
  Connect,
)(AuthorizationContainer);

