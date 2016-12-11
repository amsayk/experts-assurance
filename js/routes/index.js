import React from 'react';
import {
  IndexRedirect,
  Redirect,
  Route,
} from 'react-router';

import emptyObject from 'emptyObject';

import CoreLayout from 'layouts/CoreLayout';

import LandingRoute from 'routes/Landing';
import LoginRoute from 'routes/Login';
import SignupRoute from 'routes/Signup';
import PasswordResetRoute from 'routes/PasswordReset';
import ChoosePasswordRoute from 'routes/ChoosePassword';

import {
  PATH_LOGIN,
  PATH_INVALID_LINK,
  PATH_EMAIL_VERIFICATION_SUCCESS,
  PATH_PASSWORD_RESET_SUCCESS,
} from 'env';

export default (store) => (
  <Route path={'/'} component={CoreLayout}>
    <IndexRedirect to={'/app'}/>

    <Route {...LandingRoute(store)}/>

    <Route {...LoginRoute(store)}/>
    <Route {...SignupRoute(store)}/>
    <Route {...PasswordResetRoute(store)}/>
    <Route {...ChoosePasswordRoute(store)}/>

    <Redirect
      from={PATH_INVALID_LINK}
      to={'/'}
      state={{notify: PATH_INVALID_LINK}}
      query={emptyObject} />
    <Redirect
      from={PATH_EMAIL_VERIFICATION_SUCCESS}
      to={'/'}
      state={{notify: PATH_EMAIL_VERIFICATION_SUCCESS}}
      query={emptyObject} />
    <Redirect
      from={PATH_PASSWORD_RESET_SUCCESS}
      to={PATH_LOGIN}
      state={{notify: PATH_PASSWORD_RESET_SUCCESS}}
      query={emptyObject} />

    <Redirect from={'*'} to={'/'}/>
  </Route>
);

