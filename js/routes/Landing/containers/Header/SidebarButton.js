import React from 'react';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import { MenuIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

export default function SidebarButton({ intl, open, toggleSideBar }) {
  return (
    <div className={style.sideBarMenu}>
      <Button className={cx(style.sideBarMenuButton, open && style.sideBarMenuButtonOpen)} onClick={toggleSideBar} role='button'>
        <MenuIcon size={32}/>
      </Button>
    </div>
  );
}


