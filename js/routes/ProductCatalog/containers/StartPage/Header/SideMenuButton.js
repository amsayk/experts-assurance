import React from 'react';

import style from '../../../ProductCatalog.scss';

import { MenuIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

export default function SideMenuButton({ intl, open, toggleSideMenu }) {
  return (
    <div className={style.sideMenu}>
      <Button className={style.sideMenuButton} onClick={toggleSideMenu} role='button'>
        <MenuIcon size={32}/>
      </Button>
    </div>
  );
}

