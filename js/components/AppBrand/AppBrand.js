import React from 'react';
import { Link } from 'react-router';

import AppLogo from 'components/AppLogo';

import style from './AppBrand.scss';

export default function AppBrand({}) {
  return (
    <Link className={style.appBrand} to={'/'}>
      <AppLogo width={32} height={32}/>
    </Link>
  );
}

