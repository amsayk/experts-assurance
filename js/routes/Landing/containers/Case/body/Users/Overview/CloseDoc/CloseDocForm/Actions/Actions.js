import React, { PropTypes as T } from 'react'
import {compose} from 'redux';
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
  static displayName = 'CloseDocFormActions';

  static contextTypes = {
    store : T.object.isRequired,

  };

  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit () {
    this.context.store.dispatch(submit('closeDoc'));
  }
  render() {
    const { hide, submitting } = this.props;
    return (
      <div className={cx(style.closeDocFormActions, hide && style.hideActions)}>
        <div>
          Les données ont été validés avec succès.
        </div>
        <Button disabled={submitting} bsStyle='primary' className={style.closeDocFormActions_saveButton} onClick={this.onSubmit} role='button'>
          Clôturer le dossier
        </Button>
      </div>
    );
  }
}

const submittingSelector = isSubmitting('closeDoc');

const hideSelector = state => {
  // const pristine = isPristine('addDoc')(state);
  // if (pristine) {
  //   return true;
  // }
  const invalid = isInvalid('closeDoc')(state);
  const submissionFailed = hasSubmitFailed('closeDoc')(state);
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

export default compose(
  Connect,
)(Actions);

