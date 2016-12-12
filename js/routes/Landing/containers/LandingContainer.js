import React, { PropTypes as T } from 'react';
import { withApollo, graphql } from 'react-apollo';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Center from 'components/Center';

import { logOut } from 'redux/reducers/user/actions';

import isEmpty from 'isEmpty';

import style from '../Landing.scss';

import Header from '../components/Header';

import NotifyVerificationPending from 'components/notifications/NotifyVerificationPending';
import NotifyVerificationSuccess from 'components/notifications/NotifyVerificationSuccess';
import NotifyInvalidLink from 'components/notifications/NotifyInvalidLink';

import selector from './selector';

import MUTATION from './resendPasswordVerification.mutation.graphql';
import QUERY from './currentUser.query.graphql';

import {
    PATH_INVALID_LINK,
    PATH_EMAIL_VERIFICATION_SUCCESS,
} from 'env';

class LandingContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onResendPasswordVerification = this.onResendPasswordVerification.bind(this);
  }
  async onResendPasswordVerification() {
    const { data: { currentUser }  } = this.props;

    const { data: { resendPasswordVerification: { errors } } } = await this.props.client.mutate({
      mutation  : MUTATION,
      variables : { info: {
        email: currentUser.email,
      } },
    });

    if (!isEmpty(errors)) {
      // TODO: handle error.
    }

    // TODO: snackbar notify?
    return;
  }
  render() {
    const { data: { loading, currentUser }, notify, actions } = this.props;
    let Notification = null;
    if (!loading && currentUser && !currentUser.emailVerified) {
      Notification = () => <NotifyVerificationPending user={currentUser} onResendPasswordVerification={this.onResendPasswordVerification}/>; // eslint-disable-line
    } else if (notify === PATH_INVALID_LINK) {
      Notification = NotifyInvalidLink;
    } else if (notify === PATH_EMAIL_VERIFICATION_SUCCESS) {
      Notification = NotifyVerificationSuccess;
    }

    return (
      <div className={style.root}>
        {Notification ? <Notification/> : null}
        <Header onLogOut={actions.logOut}/>
        <Center>
          Happy to get started 😎
        </Center>
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

LandingContainer.defaultProps = {
  data: {
    loading: false,
  },
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
  withApollo,
  Connect,
  withCurrentUser,
)(LandingContainer);

