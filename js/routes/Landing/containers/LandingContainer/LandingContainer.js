import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { withApollo, graphql } from 'react-apollo';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import isEmpty from 'isEmpty';

import style from '../../Landing.scss';

import Header from '../../components/Header';

import NotifyVerificationPending from 'components/notifications/NotifyVerificationPending';
import NotifyVerificationSuccess from 'components/notifications/NotifyVerificationSuccess';
import NotifyInvalidLink from 'components/notifications/NotifyInvalidLink';

import selector from './selector';

import MUTATION from './resendEmailVerification.mutation.graphql';
import QUERY from './currentUser.query.graphql';

import {
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_DETAILS,
  PATH_INVALID_LINK,
  PATH_EMAIL_VERIFICATION_SUCCESS,
} from 'vars';

import messages from '../../messages';

import { intlShape } from 'react-intl';

export class LandingContainer extends React.PureComponent {
  static contextTypes = {
    intl     : intlShape.isRequired,
    snackbar : T.shape({
      show: T.func.isRequired,
    }),
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      mounted: true,
    };

    this.onResendEmailVerification = this.onResendEmailVerification.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.mounted) {
      return;
    }
    const { data: { loading, currentUser }, router } = nextProps;
    if (!loading) {
      if (isEmpty(currentUser.business)) {
        const pathBusinessDetails = PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_DETAILS;
        this.setState({
          mounted: false,
        }, () => {
          router.replace({
            pathname: pathBusinessDetails,
            state: {
              notify: pathBusinessDetails,
            },
          });
        });
      }
    }
  }
  async onResendEmailVerification() {
    const { data: { resendEmailVerification: { errors } } } = await this.props.client.mutate({
      mutation : MUTATION,
    });

    if (!isEmpty(errors)) {
      // TODO: handle error.
    }

    const { snackbar, intl } = this.context;
    if (snackbar) {
      snackbar.show({
        message: intl.formatMessage(messages.emailSent),
      });
    }
  }
  render() {
    const { data: { loading, currentUser }, notify, actions } = this.props;
    let Notification = null;
    if (!loading) {
      if (!currentUser.emailVerified) {
          Notification = () => <NotifyVerificationPending user={currentUser} onResendEmailVerification={this.onResendEmailVerification}/>; // eslint-disable-line
      }
    } else if (notify === PATH_INVALID_LINK) {
      Notification = NotifyInvalidLink;
    } else if (notify === PATH_EMAIL_VERIFICATION_SUCCESS) {
      Notification = NotifyVerificationSuccess;
    }

    return (
      <div className={style.root}>
        {Notification ? <Notification/> : null}
        <Header user={currentUser} onLogOut={actions.logOut}/>
        <div className={style.center}>
          Happy to get started 😎
        </div>
      </div>
    );
  }
}

LandingContainer.propTypes = {
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
  withRouter,
  withApollo,
  Connect,
  withCurrentUser,
)(LandingContainer);

