import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BlinkingDots from 'components/BlinkingDots';

import { createSelector } from 'utils/reselect';

import Button from 'components/bootstrap/Button';

import style from 'containers/Importation/styles';

import cx from 'classnames';

import { extractDocs } from 'redux/reducers/importation/actions';

class Actions extends React.Component {
  static displayName = 'Importation:Files:Actions';

  static contextTypes = {};

  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit() {
    this.props.actions.extractDocs();
  }
  render() {
    const { extractions, hide, hasDocs, extracting } = this.props;
    if (hide) {
      return null;
    }
    return (
      <div className={cx(style.dialogActions, hide && style.hideActions)}>
        {!hasDocs && extractions > 0
          ? <div className={style.msg}>Aucuns documents à validés.</div>
          : null}{' '}
        <Button
          bsStyle='primary'
          className={style.dialogActions_saveButton}
          onClick={this.onSubmit}
          role='button'
        >
          {extracting
            ? ['Extraction en cours', <BlinkingDots />]
            : 'Extraire les dossiers'}
        </Button>
      </div>
    );
  }
}

const hideSelector = state => {
  return state.getIn(['importation', 'files']).isEmpty();
};

const extractingSelector = state => {
  return state.getIn(['importation', 'extracting']);
};

const hasDocsSelector = state => {
  return !state.getIn(['importation', 'docs']).isEmpty();
};

const extractionsSelector = state => {
  return state.getIn(['importation', 'extractions']);
};

const selector = createSelector(
  hideSelector,
  extractingSelector,
  hasDocsSelector,
  extractionsSelector,
  (hide, extracting, hasDocs, extractions) => ({
    hide,
    extracting,
    hasDocs,
    extractions: extracting ? 0 : extractions,
  }),
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        extractDocs,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(Actions);
