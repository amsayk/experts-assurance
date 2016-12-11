import React, { PropTypes as T } from 'react';
import { Link, withRouter } from 'react-router';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import compose from 'recompose/compose';

import selector from './selector';

import validations from '../validations';

import style from '../ChoosePassword.scss';

import Title from 'components/Title';

import { SubmissionError, Field, reduxForm, propTypes as formPropTypes } from 'redux-form/immutable';

import {
  intlShape,
  injectIntl,
} from 'react-intl';

import { APP_NAME } from 'env';

import messages from '../messages';

import PasswordField from '../components/PasswordField';
import PasswordConfirmationField from '../components/PasswordConfirmationField';

class ChoosePasswordContainer extends React.Component {
  static propTypes = {
    ...formPropTypes,
    isAuthenticated : T.bool.isRequired,
    token           : T.string.isRequired,
    action          : T.string.isRequired,
    username        : T.string.isRequired,
    intl            : intlShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.onSubmit     = this.onSubmit.bind(this);
    this.onKeyDown    = this._onKeyDown.bind(this);
    this._setFormRef  = this._setFormRef.bind(this);
  }

  componentWillMount() {
    const { isAuthenticated, router } = this.props;
    if (isAuthenticated) {
      router.replace('/');
    }
  }

  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      const submit = this.props.handleSubmit(this.onSubmit);
      submit();
    }
  }

  async onSubmit(data) {
    try {
      await validations.asyncValidate(data);
    } catch (errors) {
      throw new SubmissionError(errors);
    }

    this._form.submit();
  }

  _renderForm() {
    const {
      intl, handleSubmit, submitting, invalid,
    } = this.props;

    return [
      <Link className={ style.logo } to={'/'}>
        <img src="/logo.svg" className={'d-inline-block align-top'} width="48" height="48" alt=""/>
      </Link>,

      <h2 className={ style.heading }>{intl.formatMessage(messages.title)}</h2>,

      <Field
        name="new_password"
        component={PasswordField}
        placeholder={intl.formatMessage(messages.password)}
        onKeyDown={this.onKeyDown} />,

      <Field
        name="passwordConfirmation"
        component={PasswordConfirmationField}
        placeholder={intl.formatMessage(messages.passwordConfirmation)}
        onKeyDown={this.onKeyDown} />,

      <button onClick={handleSubmit(this.onSubmit)} disabled={submitting || invalid} className={ 'btn btn-primary btn-block' }>
        {intl.formatMessage(messages.choosePassword)}
      </button>,

    ];
  }
  _setFormRef(form) {
    this._form = form;
  }

  render() {
    const { intl, action, username, token } = this.props;
    return (
      <div className={style.root}>
        <Title title={intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}/>
        <div className="center-content">
          <form ref={this._setFormRef} action={action} className={style.form} method={'POST'}>
            <input name="utf-8" type="hidden" value="✓" />
            <input name="username" value={username} type="hidden" />
            <input name="token" value={token} type="hidden" />
            {this._renderForm()}
          </form>
        </div>
        <footer>
          {/* © 2016 */}
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

const WithForm = reduxForm({
  form: 'choosePassword',
});

export default compose(
  injectIntl,
  withRouter,
  Connect,
  WithForm,
)(ChoosePasswordContainer);

