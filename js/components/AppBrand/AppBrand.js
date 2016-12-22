import React from 'react';
import { Link } from 'react-router';

import AppLogo from 'components/AppLogo';

import { APP_NAME } from 'vars';

export default function AppBrand({}) {
  return (
    <Link className={'navbar-brand mb-0'} to={'/'}>
      <AppLogo width={32} height={32}/>
      {' '}
      {APP_NAME}
    </Link>
  );
}

