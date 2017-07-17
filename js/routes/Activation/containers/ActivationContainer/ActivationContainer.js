import React, { PropTypes as T } from 'react';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { withApollo } from 'react-apollo';

import { APP_NAME, PATH_SETTINGS_BASE, PATH_SETTINGS_CHANGE_EMAIL } from 'vars';

import { logOut } from 'redux/reducers/user/actions';

import style from '../../Activation.scss';

import Header from '../Header';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import messages from 'routes/Activation/messages';

import isEmpty from 'isEmpty';

import selector from './selector';

import MUTATION from './resendEmailVerification.mutation.graphql';

export class ActivationContainer extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.onResendEmailVerification = this.onResendEmailVerification.bind(this);
  }
  async onResendEmailVerification() {
    const { data: { resendEmailVerification: { errors } } } = await this.props.client.mutate({
      mutation : MUTATION,
    });

    if (!isEmpty(errors)) {
      // TODO: handle error.
      return;
    }

    const { snackbar } = this.context;
    if (snackbar) {
      snackbar.show({
        message: this.props.intl.formatMessage(messages.emailSent),
      });
    }
  }
  render() {
    const { intl, user, className, actions } = this.props;
    return (
      <div className={style.root}>
        <Header user={user} onLogOut={actions.logOut}/>
        <div className={style.center}>
          <div className={style.infoLine}>
            <h3>
              <FormattedMessage
                {...messages.Thanks}
                values={{
                  appName: <strong>{APP_NAME}</strong>,
                }}
              />
            </h3>
          </div>
          <p className={style.infoLine}>
            <FormattedMessage
              {...messages.EmailVerificationPending}
              values={{
                email: <strong className={''}>{user.email}</strong>,
              }}
            />
          </p>
          <p className={style.infoLine}>
            <FormattedMessage
              {...messages.Actions}
              values={{
                resendEmailVerificationLink: (
                  <a onClick={this.onResendEmailVerification} className={style.resendLink}>
                    {intl.formatMessage(messages.ResendVerification)}
                  </a>
                ),
                changeEmail: (
                  <Link className={style.changeEmailLink} to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_EMAIL}>
                    {intl.formatMessage(messages.ChangeEmail)}
                  </Link>
                ),
              }}
            />
          </p>
        </div>
      </div>
    );
  }
}

ActivationContainer.propTypes = {
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
  withApollo,
  Connect,
)(ActivationContainer);

