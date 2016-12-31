import { PATH_SETTINGS_BASE } from 'vars';

import getAccountRoutes, { indexRoute } from './containers/Account';
import getBusinessRoutes from './containers/Business';

export default (store) => ({
  path          : PATH_SETTINGS_BASE,
  getIndexRoute : indexRoute(store),
  childRoutes   : [
    ...getAccountRoutes(store),
    ...getBusinessRoutes(store),
  ],
});

