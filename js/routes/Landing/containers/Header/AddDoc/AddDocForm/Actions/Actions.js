import React from 'react'

import Button from 'components/bootstrap/Button';

import style from 'routes/Landing/styles';

import cx from 'classnames';

export default class Actions extends React.Component {
  render() {
    const { onCancel, onSave, invalid } = this.props;
    return (
      <div className={cx(style.addDocFormActions, invalid && style.invalid)}>
        <Button bsStyle='primary' className={style.addDocFormActions_saveButton} onClick={onSave} role='button'>
          Créer le dossier
        </Button>
        <a className={style.addDocFormActions_cancelButton} onClick={onCancel} tabIndex>
          Annuler
        </a>
      </div>
    )
  }
}

