import React from 'react';

// import { EmptyIcon } from 'components/icons/MaterialIcons';
//
import style from 'routes/Landing/styles';

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
      message='Aucun dossiers à afficher'
      description='Ajouter des dossiers pour les afficher ici.'
      className={style.emptyList}
    />
  );
}

