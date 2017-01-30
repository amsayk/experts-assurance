import CoreLayout from 'layouts/CoreLayout';

import LandingRoute from 'routes/Landing';
import LoginRoute from 'routes/Login';
import SignupRoute from 'routes/Signup';
import PasswordResetRoute from 'routes/PasswordReset';
import ChoosePasswordRoute from 'routes/ChoosePassword';
import SettingsRoute from 'routes/Settings';

import ProductCatalogRoute from 'routes/ProductCatalog';

import SearchRoute from 'routes/Search';

import {
  PATH_LOGIN,
  PATH_INVALID_LINK,
  PATH_EMAIL_VERIFICATION_SUCCESS,
  PATH_PASSWORD_RESET_SUCCESS,
} from 'vars';

import { post as addNotification } from 'redux/reducers/notification/actions';

export default (store) => [{
  path          : '/',
  component     : CoreLayout,
  getIndexRoute : LandingRoute(store),
  childRoutes   : [
    LoginRoute(store),
    SignupRoute(store),
    PasswordResetRoute(store),
    ChoosePasswordRoute(store),
    SettingsRoute(store),
    ProductCatalogRoute(store),
    SearchRoute(store),

    // On invalid activation or password reset link
    {
      path: PATH_INVALID_LINK,
      onEnter(_, replace) {
        replace({
          pathname : '/',
          query    : {},
        });
        store.dispatch(addNotification('InvalidLink', {}));
      },
    },

    {
      path: PATH_EMAIL_VERIFICATION_SUCCESS,
      onEnter(_, replace) {
        replace({
          pathname : '/',
          query    : {},
        });
        store.dispatch(addNotification('VerificationSuccess', {}));
      },
    },

    {
      path: PATH_PASSWORD_RESET_SUCCESS,
      onEnter(_, replace) {
        replace({
          pathname : PATH_LOGIN,
          query    : {},
        });
        store.dispatch(addNotification('PasswordResetSuccess', {}));
      },
    },

    // TODO
    // { path: '*', component: NotFound },
  ],
}];

