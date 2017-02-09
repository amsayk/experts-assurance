import { createSelector } from 'utils/reselect';

import {
  PATH_PRODUCT_CATALOG_PRODUCT_PARAM,
} from 'vars';

const userSelector = state => state.get('user');
const productIdSelector = (_, { params }) => params[PATH_PRODUCT_CATALOG_PRODUCT_PARAM];

export default createSelector(
  userSelector,
  productIdSelector,
  (user, productId) => ({ user, productId })
);

