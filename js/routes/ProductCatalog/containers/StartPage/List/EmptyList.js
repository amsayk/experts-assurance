import React from 'react';

import { EmptyIcon } from 'components/icons/MaterialIcons';

import style from '../../../ProductCatalog.scss';

export default function EmptyList() {
  return (
    <div className={style.emptyList}>
      <div className={style.icon}>
        <EmptyIcon size={128}/>
      </div>
      <div className={style.desc}>No products in catalog</div>
    </div>
  );
}

