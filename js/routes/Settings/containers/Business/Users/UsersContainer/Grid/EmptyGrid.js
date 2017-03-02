import React from 'react';

import { EmptyIcon } from 'components/icons/MaterialIcons';

import style from 'routes/Settings/styles';

export default function EmptyGrid() {
  return (
    <div className={style.emptyGrid}>
      <div className={style.icon}>
        <EmptyIcon size={128}/>
      </div>
      <div className={style.desc}>
        Aucun utilisateurs en ce moment.
      </div>
    </div>
  );
}

