import { graphql } from 'react-apollo';

import CURRENT_USER_QUERY from './currentUser.query.graphql';
import GET_PRODUCTS_QUERY from './getProducts.query.graphql';
import GET_PRODUCT_QUERY from './getProduct.query.graphql';
import LABELS_QUERY from './labels.query.graphql';

import CATALOG_RECENT_QUERY from './catalogRecent.query.graphql';

import pick from 'lodash.pick';

const products = graphql(GET_PRODUCTS_QUERY, {
  options: (ownProps) => ({
    variables: {
      query : {
        label      : ownProps.label,
        sortConfig : pick(ownProps.sortConfig, ['key', 'direction']),
      },
    },
  }),
  props: ({ ownProps, data: { loading, getProducts: { cursor, length, products = [] } = {}, fetchMore } }) => ({
    loading,
    products,
    cursor,
    length,
    loadMoreProducts() {
      return fetchMore({
        variables: {
          query : {
            cursor,
            label      : ownProps.label,
            sortConfig : pick(ownProps.sortConfig, ['key', 'direction']),
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newProducts = fetchMoreResult.data.getProducts.products;

          return {
            getProducts : {
              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.data.getProducts.cursor,

              length: fetchMoreResult.data.getProducts.length,

              // Put the new products at the end of the list
              products: [
                ...previousResult.getProducts.products,
                ...newProducts,
              ],
            },
          };
        },
      });
    },
  }),
});

const catalogRecent = graphql(CATALOG_RECENT_QUERY, {
  options: (ownProps) => ({
    variables: {
      id : ownProps.query,
    },
  }),
  skip: ({ app }) => !app.isReady,
  props: ({ ownProps, data: { loading, catalogRecent = { labels: [], products: [] } } }) => ({
    loading,
    recent : catalogRecent,
  }),
});

const product = graphql(GET_PRODUCT_QUERY, {
  options: (ownProps) => ({
    variables: {
      id : ownProps.productId,
    },
  }),
  props: ({ ownProps, data: { getProduct : product } }) => ({
    product,
  }),
});

const currentUser = graphql(CURRENT_USER_QUERY, {
  options: ({ user }) => ({ variables: { id: user.id } }),
  skip: ({ user }) => user.isEmpty(),
});

const labels = graphql(LABELS_QUERY, {
  options: () => ({
  }),
  props: ({ data: { loading, labels = [] } }) => ({
    loading,
    labels,
  }),
});

export default { labels, products, product, currentUser, catalogRecent };

