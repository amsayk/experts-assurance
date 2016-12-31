import React, { PropTypes as T } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import withZxcvbn from './withZxcvbn';

import { createSelector } from 'utils/reselect';

import cx from 'classnames';

import style from '../Settings.scss';

import { injectIntl, intlShape } from 'react-intl';

import messages from '../messages';

function PasswordMeter({ intl, score}) {
  return (
    <div className={cx(style.passwordStrength, { [style[`passwordStrength-${score}`]]: score })}>
      {score ? intl.formatMessage(messages.passwordStrength, {
        scoreWord: intl.formatMessage(messages[`passwordStrengthScoreWord${score}`]),
      }) : null}
    </div>
  );
}

PasswordMeter.propTypes = {
  intl: intlShape.isRequired,
  score: T.number.isRequired,
};

const passwordSelector = createSelector(
  (_, { password }) => password,
  (password) => password
);


const zxcvbnSelector = createSelector(
  passwordSelector,
  (_, { zxcvbn }) => zxcvbn,
  (password, zxcvbn) => (password ? zxcvbn(password) : { score: 0 })
);

const selector = createSelector(
  zxcvbnSelector,
  ({ score }) => ({ score })
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(
  injectIntl,
  withZxcvbn,
  Connect,
)(PasswordMeter);

