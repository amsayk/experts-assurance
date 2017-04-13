import React from 'react'
import { compose } from 'redux';

import DataLoader from 'routes/Landing/DataLoader';

import style from 'routes/Landing/styles';

class Title extends React.Component {
  render() {
    const { loading, lastRefNo } = this.props;
    return (
      <div className={style.addDocFormTitleWrapper}>
        <div className={style.addDocFormTitle}>
          <h6>Ajouter dossier <b>{loading ? null : (lastRefNo + 1)}</b>
          </h6>
          <h4>Entrer les informations réquises pour créer le dossier.
          </h4>
        </div>
      </div>
    )
  }
}

export default compose(
  DataLoader.lastRefNo,
)(Title);

