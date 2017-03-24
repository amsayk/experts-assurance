import React from 'react';

// import { EmptyIcon } from 'components/icons/MaterialIcons';
//
import style from 'routes/Settings/styles';

import Empty from 'components/Empty';

export default function EmptyList() {
  return (
    // <div className={style.emptyList}>
    //   <div className={style.icon}>
    //     <EmptyIcon size={128}/>
    //   </div>
    //   <div className={style.desc}>
    //     Aucun dossiers pour le moment.
    //   </div>
    // </div>
    <Empty
      message='Aucun utilisateurs à afficher'
      description={'Une fois il y a des utilisateurs, ils s\'afficheront ici.'}
      className={style.emptyList}
    />
  );
}

