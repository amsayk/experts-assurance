import CoreLayout from 'layouts/CoreLayout';

import LandingRoute from 'routes/Landing';
import LoginRoute from 'routes/Login';
import SignupRoute from 'routes/Signup';
import PasswordResetRoute from 'routes/PasswordReset';
import ChoosePasswordRoute from 'routes/ChoosePassword';
import SettingsRoute from 'routes/Settings';

import {
  PATH_LOGIN,
  PATH_INVALID_LINK,
  PATH_EMAIL_VERIFICATION_SUCCESS,
  PATH_PASSWORD_RESET_SUCCESS,
} from 'vars';

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

    // On invalid activation or password reset link
    {
      path: PATH_INVALID_LINK,
      onEnter(_, replace) {
        replace({
          pathname : '/',
          query    : {},
          state    : {
            notify: PATH_INVALID_LINK,
          },
        });
      },
    },

    {
      path: PATH_EMAIL_VERIFICATION_SUCCESS,
      onEnter(_, replace) {
        replace({
          pathname : '/',
          query    : {},
          state    : {
            notify: PATH_EMAIL_VERIFICATION_SUCCESS,
          },
        });
      },
    },

    {
      path: PATH_PASSWORD_RESET_SUCCESS,
      onEnter(_, replace) {
        replace({
          pathname : PATH_LOGIN,
          query    : {},
          state    : {
            notify: PATH_PASSWORD_RESET_SUCCESS,
          },
        });
      },
    },

    // TODO
    // { path: '*', component: NotFound },
  ],
}];

