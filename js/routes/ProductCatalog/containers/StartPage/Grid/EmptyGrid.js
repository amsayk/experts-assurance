import React from 'react';

import { EmptyIcon } from 'components/icons/MaterialIcons';

import style from '../../../ProductCatalog.scss';

export default function EmptyGrid() {
  return (
    <div className={style.emptyGrid}>
      <div className={style.icon}>
        <EmptyIcon size={128}/>
      </div>
      <div className={style.desc}>No products in catalog</div>
    </div>
  );
}

