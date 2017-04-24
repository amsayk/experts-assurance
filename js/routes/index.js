import CoreLayout from 'layouts/CoreLayout';

import Landing from 'routes/Landing';
import LoginRoute from 'routes/Login';
import ActivationRoute from 'routes/Activation';
import AuthorizationRoute from 'routes/Authorization';
import SignupRoute from 'routes/Signup';
import PasswordResetRoute from 'routes/PasswordReset';
import ChoosePasswordRoute from 'routes/ChoosePassword';
import SettingsRoute from 'routes/Settings';

import PublicRoute from 'routes/Public';

import SearchRoute from 'routes/Search';

import {
  PUBLIC,

  PATH_LOGIN,
  PATH_INVALID_LINK,
  PATH_EMAIL_VERIFICATION_SUCCESS,
  PATH_PASSWORD_RESET_SUCCESS,
} from 'vars';

import { post as addNotification } from 'redux/reducers/notification/actions';

export default PUBLIC ? PublicRoute : (store) => [{
  path          : '/',
  component     : CoreLayout,
  getIndexRoute : Landing.getIndexRoute(store),
  childRoutes   : [
    LoginRoute(store),
    ActivationRoute(store),
    AuthorizationRoute(store),
    SignupRoute(store),
    PasswordResetRoute(store),
    ChoosePasswordRoute(store),
    SettingsRoute(store),
    SearchRoute(store),
    ...Landing.routes(store),

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

