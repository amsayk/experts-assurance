import React from 'react';
import { Link } from 'react-router';

import { APP_NAME } from 'vars';

export default function AppBrand({}) {
  return (
    <Link className={'navbar-brand mb-0'} to={'/'}>
      <img src={'/logo.svg'} className={'d-inline-block align-top'} width={'35'} height={'35'} alt=""/>
      {APP_NAME}
    </Link>
  );
}

