import React from 'react';
import T from 'prop-types';
import { Link } from 'react-router';

import { compose } from 'redux';

import { withApollo } from 'react-apollo';

import refreshCurrentUser from 'utils/refreshCurrentUser';

import {
  reduxForm,
  Field,
  propTypes as reduxFormPropTypes,
  SubmissionError,
} from 'redux-form/immutable';

import isEmpty from 'isEmpty';

import { intlShape } from 'react-intl';

import messages from 'routes/Settings/messages';

import style from 'routes/Settings/styles';

import CurrentPasswordField from '../../../components/CurrentPasswordField';
import NewPasswordField from '../../../components/NewPasswordField';

import { PATH_SETTINGS_BASE, PATH_LOGIN } from 'vars';

import MUTATION from './setPassword.mutation.graphql';

export class ChangePasswordForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onKeyDown = this._onKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      const submit = this.props.handleSubmit(this.onSubmit);
      submit();
    }
  }

  async onSubmit(data) {
    const {
      data: { setPassword: { errors } },
    } = await this.props.client.mutate({
      mutation: MUTATION,
      variables: {
        payload: {
          currentPassword: data.get('currentPassword'),
          newPassword: data.get('newPassword'),
        },
      },
    });

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }

    const { intl } = this.props;
    const { snackbar } = this.context;
    if (snackbar) {
      snackbar.show({
        message: intl.formatMessage(messages.passwordChangeSuccessNotification),
      });
    }

    await refreshCurrentUser();
  }

  render() {
    const { intl, handleSubmit, pristine, submitting } = this.props;
    return (
      <div className={style.content}>
        <h1 className={style.formHeading}>
          {intl.formatMessage(messages.titleChangePassword)}
        </h1>
        <div className={style.form}>
          <Field
            name='currentPassword'
            component={CurrentPasswordField}
            label={intl.formatMessage(messages.labelCurrentPassword)}
            onKeyDown={this.onKeyDown}
          />
          <div style={{ marginTop: 15 }} />
          <Field
            name='newPassword'
            component={NewPasswordField}
            label={intl.formatMessage(messages.labelNewPassword)}
            onKeyDown={this.onKeyDown}
          />
          <div className={style.buttonGroup}>
            <button
              onClick={handleSubmit(this.onSubmit)}
              disabled={pristine || submitting}
              className={style.changePasswordButton}
            >
              {intl.formatMessage(messages.changePassword)}
            </button>
            <Link to={PATH_SETTINGS_BASE} className={style.cancelButton}>
              {intl.formatMessage(messages.cancel)}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

ChangePasswordForm.contextTypes = {
  snackbar: T.shape({
    show: T.func.isRequired,
  }),
};

ChangePasswordForm.defaultProps = {};

ChangePasswordForm.propTypes = {
  ...reduxFormPropTypes,
  intl: intlShape.isRequired,
};

const Form = reduxForm({
  form: 'changePassword',
});

export default compose(withApollo, Form)(ChangePasswordForm);
