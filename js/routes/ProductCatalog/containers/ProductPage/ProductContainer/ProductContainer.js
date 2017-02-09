import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Title from 'components/Title';

import {
  APP_NAME,
  PATH_PRODUCT_CATALOG_BASE,
} from 'vars';

import Header from '../Header';

import DataLoader from '../../../utils/DataLoader';

import { setSelection } from 'redux/reducers/catalog/actions';

import style from '../../../ProductCatalog.scss';

import messages from '../../../messages';

import { injectIntl, intlShape } from 'react-intl';

import selector from './selector';

export class ProductContainer extends React.PureComponent {
  constructor() {
    super();

    this.onBack = this.onBack.bind(this);
  }
  onBack() {
    const { location, actions } = this.props;

    actions.setSelection([]);

    if (location.action === 'PUSH') {
      this.props.router.goBack();
    } else {
      this.props.router.push({
        pathname : PATH_PRODUCT_CATALOG_BASE,
      });
    }

  }
  render() {
    const {
      intl,
      data: { currentUser },
      product,
    } = this.props;
    return (
      <div className={style.root}>
        {product ? <Title title={intl.formatMessage(messages.productTitle, { productName: product.displayName, appName: APP_NAME })}/> : null}
        <Header user={currentUser} onBack={this.onBack} product={product}/>
        <div className={style.center}>
          Welcome to the {product ? product.displayName + '\'s product' : 'product'} page 😎
        </div>
      </div>
    );
  }
}

ProductContainer.propTypes = {
  intl: intlShape.isRequired,
  data: T.shape({
    loading: T.bool.isRequired,
    currentUser: T.object,
    product: T.object,
  }).isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ setSelection }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  withRouter,
  withApollo,
  Connect,
  DataLoader.product,
  DataLoader.currentUser,
)(ProductContainer);

