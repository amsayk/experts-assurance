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
      noIcon
      message='Félicitation!'
      description={'Vous n\'avez aucun dossiers en cours de traitement.'}
      className={style.dashboardEmpyList}
    />
  );
}

