import React from 'react';

import { EmptyIcon } from 'components/icons/MaterialIcons';

import style from 'routes/Landing/styles';

export default function EmptyList() {
  return (
    <div className={style.emptyList}>
      <div className={style.icon}>
        <EmptyIcon size={128}/>
      </div>
      <div className={style.desc}>
        Aucun dossiers pour le moment.
      </div>
    </div>
  );
}

