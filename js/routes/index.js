import React from 'react';
import {
  IndexRedirect,
  Redirect,
  Route
} from 'react-router';

import CoreLayout from 'layouts/CoreLayout';

import LandingRoute from 'routes/Landing';

export default (store) => (
    <Route path={'/'} component={CoreLayout}>
      <IndexRedirect to={'/app'}/>
      <Route {...LandingRoute(store)}/>
      <Redirect from={'*'} to={'/app'}/>
    </Route>
);

