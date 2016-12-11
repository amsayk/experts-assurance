import React, { PropTypes as T } from 'react';
import {connect} from 'react-redux';
import { getFormValues } from 'redux-form/immutable';

import compose from 'recompose/compose';

import cx from 'classnames';

import { injectIntl, intlShape } from 'react-intl';

import style from '../PasswordReset.scss';

function NotifySuccess({ intl, email }) {
  return (
    <div className={cx(style.notification, 'alert alert-warning')}>
      We sent an email to <strong className={''}>{email}</strong>. Please check your mail.
    </div>
  );
}

NotifySuccess.propTypes = {
  intl: intlShape.isRequired,
  email: T.string.isRequired,
};

function mapStateToProps(state, { form }) {
  return {
    email: getFormValues(form)(state).get('email'),
  };
}

const Connect = connect(mapStateToProps);

export default compose(
  injectIntl,
  Connect
)(NotifySuccess);

