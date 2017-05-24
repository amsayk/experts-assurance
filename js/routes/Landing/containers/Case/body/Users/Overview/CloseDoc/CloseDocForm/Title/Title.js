import React from 'react'
import { compose } from 'redux';

import DataLoader from 'routes/Landing/DataLoader';

import style from 'routes/Landing/styles';

class Title extends React.Component {
  render() {
    const { doc } = this.props;
    return (
      <div className={style.closeDocFormTitleWrapper}>
        <div className={style.closeDocFormTitle}>
            <h6>{doc.payment ? 'Confirmer les détails' : <span>Clôture de dossier <b>{doc.refNo}</b></span>}
          </h6>
          <h4>Entrer les informations nécessaires pour pouvoir clôturer le dossier.
          </h4>
        </div>
      </div>
    )
  }
}

export default compose(
)(Title);

