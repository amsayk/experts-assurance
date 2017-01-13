import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router';

import { withApollo } from 'react-apollo';

import style from '../Notification.scss';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_CHANGE_EMAIL } from 'vars';

import messages from '../messages';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import cx from 'classnames';

import isEmpty from 'isEmpty';

import MUTATION from './resendEmailVerification.mutation.graphql';
import selector from './selector';

class VerificationPending extends React.Component {
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
    }

    const { snackbar } = this.context;
    if (snackbar) {
      snackbar.show({
        message: this.props.intl.formatMessage(messages.emailSent),
      });
    }
  }
  render() {
    const { intl, user, className } = this.props;
    const values = {
      email: <strong className={''}>{user.email}</strong>,
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
    };
    return (
      <div className={cx(className, style.notificationVerificationPending)}>
        <FormattedMessage
          {...messages.EmailVerificationPending}
          values={values}
        />
      </div>
    );
  }
}

VerificationPending.contextTypes = {
  snackbar: T.shape({
    show: T.func.isRequired,
  }),
};

VerificationPending.propTypes = {
  intl : intlShape.isRequired,
  user : T.object.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(
  injectIntl,
  withApollo,
  Connect,
)(VerificationPending);

