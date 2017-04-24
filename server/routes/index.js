import CoreLayout from 'layouts/CoreLayout';

import Landing from './Landing';
import LoginRoute from './Login';
import ActivationRoute from './Activation';
import AuthorizationRoute from './Authorization';
import SignupRoute from './Signup';
import PasswordResetRoute from './PasswordReset';
import ChoosePasswordRoute from './ChoosePassword';
import SettingsRoute from './Settings';

import PublicRoute from './Public';

import SearchRoute from './Search';

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
  getComponent(nextState, cb) {
    cb(null, CoreLayout);
  },
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

