import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { withApollo, graphql } from 'react-apollo';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Title from 'components/Title';

import DataLoader from 'routes/Search/DataLoader';

import { APP_NAME } from 'vars';

import { injectIntl, intlShape } from 'react-intl';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Search/styles';

import messages from '../../messages';

import Header from '../Header';
import List from '../Cases_List';

import selector from './selector';

export class SearchContainer extends React.PureComponent {
  render() {
    const {
      intl,
      isReady,
      user : currentUser,
      loading = false,
      cursor = 0,
      length = 0,
      took,
      hits = [],
      loadMoreDocs,
      actions,
    } = this.props;
    return (
      <div className={style.root}>
        <Title title={intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}/>
        <Header length={length} user={currentUser} onLogOut={actions.logOut}/>
        <List
          cursor={cursor}
          length={length}
          loading={loading}
          hits={hits}
          took={took}
          user={currentUser}
          isReady={isReady}
          loadMoreDocs={loadMoreDocs}
          actions={actions}
        />
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
  return {actions: bindActionCreators({
    logOut,
  }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  withRouter,
  withApollo,
  Connect,
  DataLoader.queryDocs,
)(SearchContainer);

