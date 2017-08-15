import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BlinkingDots from 'components/BlinkingDots';

import { createSelector } from 'utils/reselect';

import Button from 'components/bootstrap/Button';

import style from 'containers/Importation/styles';

import cx from 'classnames';

import { show } from 'redux/reducers/importation/actions';

import { UploadStatus } from 'redux/reducers/importation/constants';

class Actions extends React.Component {
  static displayName = 'Importation:Upload:Actions';

  static contextTypes = {};

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {}
  render() {
    const { uploadStatus, progress, total, actions } = this.props;

    if (uploadStatus === UploadStatus.ERROR) {
      return (
        <div
          style={styles.error}
          className={cx(style.dialogActions, style.error)}
        >
          <span style={{ marginRight: 12 }}>Erreur d'importation.</span>
          <Button bsStyle='danger' onClick={actions.show} role='button'>
            Récommencer
          </Button>
        </div>
      );
    }

    if (uploadStatus === UploadStatus.IN_PROGRESS) {
      return (
        <div className={style.dialogActions}>
          <span style={{ ...styles.progress }}>Importation en cours</span>
          <BlinkingDots />
          {total
            ? <span style={{ ...styles.progress }}>
                {progress}/{total}
              </span>
            : null}
        </div>
      );
    }

    return (
      <div className={style.dialogActions}>
        {uploadStatus === UploadStatus.SUCCESS
          ? <span style={{ marginRight: 12, ...styles.success }}>Succès.</span>
          : null}
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

const uploadStatusSelector = state => {
  return state.getIn(['importation', 'uploadStatus']);
};

const progressSelector = state => {
  return state.getIn(['importation', 'progress']);
};

const totalSelector = state => {
  return state.getIn(['importation', 'total']);
};

const selector = createSelector(
  uploadStatusSelector,
  progressSelector,
  totalSelector,
  (uploadStatus, progress, total) => ({
    uploadStatus,
    progress,
    total,
  }),
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        show,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(Actions);
