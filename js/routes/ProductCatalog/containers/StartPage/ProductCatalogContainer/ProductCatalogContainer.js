import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Title from 'components/Title';

import { logOut } from 'redux/reducers/user/actions';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
} from 'redux/reducers/catalog/constants';

import {
  APP_NAME,
  PATH_PRODUCT_CATALOG_LABEL_PARAM,
} from 'vars';

import style from '../../../ProductCatalog.scss';

import messages from '../../../messages';

import { injectIntl, intlShape } from 'react-intl';

import DataLoader from '../../../utils/DataLoader';

import cx from 'classnames';

import Header from '../Header';
import List from '../List';
import Grid from '../Grid';

import selector from './selector';

export class ProductCatalogContainer extends React.PureComponent {
  render() {
    const {
      intl,
      data: { currentUser },
      viewType,
      params : { [PATH_PRODUCT_CATALOG_LABEL_PARAM]: label } = {},
      sortConfig,
      actions,
    } = this.props;
    const isListView = viewType === VIEW_TYPE_LIST;
    return (
      <div className={cx(style.root, { [style.listView]: isListView })}>
        <Title title={label ? intl.formatMessage(messages.labelTitle, { label, appName: APP_NAME }) : intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}/>
        <Header user={currentUser} onLogOut={actions.logOut}/>
        {isListView
            ? <List sortConfig={sortConfig} label={label}/>
            : <Grid sortConfig={sortConfig} label={label}/>}
      </div>
    );
  }
}

ProductCatalogContainer.propTypes = {
  intl: intlShape.isRequired,
  viewType: T.oneOf([
    VIEW_TYPE_LIST,
    VIEW_TYPE_GRID,
  ]).isRequired,
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
  withRouter,
  withApollo,
  Connect,
  DataLoader.currentUser,
)(ProductCatalogContainer);

