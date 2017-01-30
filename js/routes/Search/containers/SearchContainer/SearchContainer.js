import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { withApollo, graphql } from 'react-apollo';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import style from '../../Search.scss';

import Header from '../Header';

import selector from './selector';

import QUERY from './currentUser.query.graphql';

export class SearchContainer extends React.PureComponent {
  render() {
    const { data: { currentUser }, actions } = this.props;
    return (
      <div className={style.root}>
        <Header user={currentUser} onLogOut={actions.logOut}/>
        <div className={style.center}>
          Search results will appear here.
        </div>
      </div>
    );
  }
}

SearchContainer.propTypes = {
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
  options: ({ user }) => ({ variables: { id: user.id } }),
  skip: ({ user }) => user.isEmpty(),
});

export default compose(
  withRouter,
  withApollo,
  Connect,
  withCurrentUser,
)(SearchContainer);

