import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BlinkingDots from 'components/BlinkingDots';

import { createSelector } from 'utils/reselect';

import Button from 'components/bootstrap/Button';

import style from 'containers/Importation/styles';

import cx from 'classnames';

import { uploadDocs, startImporting } from 'redux/reducers/importation/actions';

class Actions extends React.Component {
  static displayName = 'Importation:Upload:Actions';

  static contextTypes = {};

  onSubmit() {
    this.props.actions.uploadDocs();
  }
  render() {
    const { hasError, uploading, actions } = this.props;

    if (hasError) {
      return (
        <div
          style={styles.error}
          className={cx(style.dialogActions, style.error)}
        >
          Erreur d'importation.
          <Button
            bsStyle='danger'
            onClick={actions.startImporting}
            role='button'
          >
            Récommencer
          </Button>
        </div>
      );
    }

    return (
      <div className={style.dialogActions}>
        {uploading
          ? ['Importation en cours', <BlinkingDots />]
          : <Button
              bsStyle='primary'
              className={style.dialogActions_saveButton}
              onClick={this.onSubmit}
              role='button'
            >
              Commencer l'importation
            </Button>}
      </div>
    );
  }
}

const styles = {
  success: {
    fontSize: 16,
    fontWeight: 700,
    color: '#5cb85c',
  },
  error: {
    fontSize: 16,
    fontWeight: 700,
    color: '##d9534f',
  },
  progress: {
    fontSize: 16,
    fontWeight: 700,
  },
};
const hasErrorSelector = state => {
  return state.getIn(['importation', 'uploadError']);
};

const uploadingSelector = state => {
  return state.getIn(['importation', 'uploading']);
};

const selector = createSelector(
  hasErrorSelector,
  uploadingSelector,
  (hasError, uploading) => ({ hasError, uploading }),
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        uploadDocs,
        startImporting,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(Actions);
