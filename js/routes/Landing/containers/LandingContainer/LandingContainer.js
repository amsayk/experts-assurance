import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { withApollo, graphql } from 'react-apollo';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import style from '../../Landing.scss';

import Header from '../../components/Header';

import selector from './selector';

import QUERY from './currentUser.query.graphql';

export class LandingContainer extends React.PureComponent {
  render() {
    const { data: { currentUser }, actions } = this.props;
    return (
      <div className={style.root}>
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

