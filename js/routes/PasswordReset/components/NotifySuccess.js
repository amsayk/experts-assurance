import React, { PropTypes as T } from 'react';
import {connect} from 'react-redux';
import { getFormValues } from 'redux-form/immutable';

import { compose } from 'redux';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import messages from '../messages';

import style from '../PasswordReset.scss';

function NotifySuccess({ intl, email }) {
  const values = {
    email: <strong className={''}>{email}</strong>,
  };
  return (
    <div className={style.notificationSuccess}>
      <FormattedMessage
        {...messages.emailSent}
        values={values}
      />
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

