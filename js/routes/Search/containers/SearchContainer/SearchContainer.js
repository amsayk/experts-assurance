import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { withApollo, graphql } from 'react-apollo';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Title from 'components/Title';

import { APP_NAME } from 'vars';

import { injectIntl, intlShape } from 'react-intl';

import { logOut } from 'redux/reducers/user/actions';

import style from '../../Search.scss';

import messages from '../../messages';

import Header from '../Header';

import selector from './selector';

import QUERY from './currentUser.query.graphql';

export class SearchContainer extends React.PureComponent {
  render() {
    const { intl, data: { currentUser }, actions } = this.props;
    return (
      <div className={style.root}>
        <Title title={intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}/>
        <Header user={currentUser} onLogOut={actions.logOut}/>
        <div className={style.center}>
          Search results will appear here.
        </div>
      </div>
    );
  }
}

SearchContainer.propTypes = {
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
  options: ({ user }) => ({ variables: { id: user.id } }),
  skip: ({ user }) => user.isEmpty(),
});

export default compose(
  injectIntl,
  withRouter,
  withApollo,
  Connect,
  withCurrentUser,
)(SearchContainer);

