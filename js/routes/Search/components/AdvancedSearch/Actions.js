import React from 'react'

import Button from 'components/bootstrap/Button';

import style from 'routes/Search/styles';

export default class Actions extends React.Component {
  render() {
    const { actions } = this.props;
    return (
      <div className={style.advancedSearh_actions}>
        <Button onClick={actions.onClear} bsStyle='link' className={style.advancedSearch_cancelButton}>
          Annuler
        </Button>
        <Button onClick={actions.onSearch} bsStyle='primary' className={style.advancedSearch_searchButton}>
          Rechercher
        </Button>
      </div>
    );
  }
}

