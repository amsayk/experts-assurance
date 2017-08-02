import React from 'react';
import T from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import Button from 'components/bootstrap/Button';

import { submit } from 'redux-form/immutable';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import {
  isPristine,
  isInvalid,
  isSubmitting,
  hasSubmitFailed,
} from 'redux-form/immutable';

class Actions extends React.Component {
  static displayName = 'AddDocFormActions';

  static contextTypes = {
    store: T.object.isRequired,
  };

  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit() {
    this.context.store.dispatch(submit('addDoc'));
  }
  render() {
    const { hide, submitting } = this.props;
    return (
      <div className={cx(style.addDocFormActions, hide && style.hideActions)}>
        <div>Les données ont été validés avec succès.</div>
        <Button
          disabled={submitting}
          bsStyle='primary'
          className={style.addDocFormActions_saveButton}
          onClick={this.onSubmit}
          role='button'
        >
          Créer le dossier
        </Button>
      </div>
    );
  }
}

const submittingSelector = isSubmitting('addDoc');

const hideSelector = state => {
  // const pristine = isPristine('addDoc')(state);
  // if (pristine) {
  //   return true;
  // }
  const invalid = isInvalid('addDoc')(state);
  const submissionFailed = hasSubmitFailed('addDoc')(state);
  return invalid && !submissionFailed;
};

const selector = createSelector(
  hideSelector,
  submittingSelector,
  (hide, submitting) => ({ hide, submitting }),
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(Connect)(Actions);
