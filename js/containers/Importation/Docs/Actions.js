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
  startImporting,
} from 'redux/reducers/importation/actions';

class Actions extends React.Component {
  static displayName = 'Importation:Docs:Actions';

  static contextTypes = {};

  componentDidMount() {
    setTimeout(this.props.actions.validateDocs, (__DEV__ ? 0 : 2) * 1000);
  }
  render() {
    const { scrollTop = 0, hasError, validating, success, actions } = this.props;

    if (hasError) {
      return (
        <div
          style={styles.error}
          className={cx(style.dialogActions, style.error)}
        >
          Certaines dossiers sont invalides.<span style={{ marginRight: 6 }} />
          <Button
            bsStyle='danger'
            onClick={actions.startImporting}
            role='button'
          >
            Récommencer l'importation
          </Button>
        </div>
      );
    }

    if (success) {
      return (
        <div style={styles.success} className={style.dialogActions}>
          Dossiers valides.
        </div>
      );
    }

    if (validating) {
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

const hasErrorSelector = state => {
  return !state.getIn(['importation', 'validationErrors']).isEmpty();
};

const validatingSelector = state => {
  return state.getIn(['importation', 'validating']);
};

const successSelector = state => {
  return (
    state.getIn(['importation', 'validations']).size ===
    state.getIn(['importation', 'docs']).size
  );
};

const selector = createSelector(
  hasErrorSelector,
  validatingSelector,
  successSelector,
  (hasError, validating, success) => ({ hasError, validating, success }),
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        validateDocs,
        startImporting,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(Actions);
