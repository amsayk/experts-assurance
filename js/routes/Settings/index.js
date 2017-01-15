import { PATH_SETTINGS_BASE } from 'vars';

import getAccountRoutes, { getIndexRoute } from './containers/Account';
import getBusinessRoutes from './containers/Business';

export default (store) => ({
  path          : PATH_SETTINGS_BASE,
  getIndexRoute : getIndexRoute(store),
  childRoutes   : [
    ...getAccountRoutes(store),
    ...getBusinessRoutes(store),
  ],
});

