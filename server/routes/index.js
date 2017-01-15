import CoreLayout from 'layouts/CoreLayout';

import LandingRoute from './Landing';
import LoginRoute from './Login';
import SignupRoute from './Signup';
import PasswordResetRoute from './PasswordReset';
import ChoosePasswordRoute from './ChoosePassword';
import SettingsRoute from './Settings';

import {
  PATH_LOGIN,
  PATH_INVALID_LINK,
  PATH_EMAIL_VERIFICATION_SUCCESS,
  PATH_PASSWORD_RESET_SUCCESS,
} from 'vars';

import { post as addNotification } from 'redux/reducers/notification/actions';

export default (store) => [{
  path          : '/',
  getComponent(nextState, cb) {
    cb(null, CoreLayout);
  },
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

