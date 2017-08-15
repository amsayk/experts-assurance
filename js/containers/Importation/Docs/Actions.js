import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BlinkingDots from 'components/BlinkingDots';

import { createSelector } from 'utils/reselect';

import Button from 'components/bootstrap/Button';

import style from 'containers/Importation/styles';

import cx from 'classnames';

import {
  validateDocs,
  uploadDocs,
  show,
} from 'redux/reducers/importation/actions';

import { ValidationStatus } from 'redux/reducers/importation/constants';

class Actions extends React.Component {
  static displayName = 'Importation:Docs:Actions';

  static contextTypes = {};

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.props.actions.uploadDocs();
  }
  componentDidMount() {
    setTimeout(this.props.actions.validateDocs, (__DEV__ ? 0 : 2) * 1000);
  }
  render() {
    const { scrollTop = 0, validationStatus, actions } = this.props;

    if (validationStatus === ValidationStatus.ERROR) {
      return (
        <div
          style={styles.error}
          className={cx(style.dialogActions, style.error)}
        >
          Certaines dossiers sont invalides.<span style={{ marginRight: 6 }} />
          <Button bsStyle='danger' onClick={actions.show} role='button'>
            Récommencer l'importation
          </Button>
        </div>
      );
    }

    if (validationStatus === ValidationStatus.SUCCESS) {
      return (
        <div style={styles.success} className={style.dialogActions}>
          <span style={{ marginRight: 12 }}>Dossiers valides.</span>
          <Button
            bsStyle='primary'
            className={style.dialogActions_saveButton}
            onClick={this.onSubmit}
            role='button'
          >
            Commencer l'importation
          </Button>
        </div>
      );
    }

    if (validationStatus > ValidationStatus.PENDING) {
      return (
        <div style={styles.progress} className={style.dialogActions}>
          Validation en cours
          <BlinkingDots />
        </div>
      );
    }

    return null;
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

const validationStatusSelector = state => {
  return state.getIn(['importation', 'validationStatus']);
};

const selector = createSelector(validationStatusSelector, validationStatus => ({
  validationStatus,
}));

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        uploadDocs,
        validateDocs,
        show,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(Actions);
