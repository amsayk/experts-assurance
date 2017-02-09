import { PATH_PRODUCT_CATALOG_BASE } from 'vars';

import getCatalogRoutes, { getIndexRoute } from './containers/StartPage';
import getProductRoutes from './containers/ProductPage';

export default (store) => ({
  path          : PATH_PRODUCT_CATALOG_BASE,
  getIndexRoute : getIndexRoute(store),
  childRoutes   : [
    ...getCatalogRoutes(store),
    ...getProductRoutes(store),
  ],
});

