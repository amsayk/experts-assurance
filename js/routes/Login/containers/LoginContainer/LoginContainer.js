import React from 'react';
import T from 'prop-types';
import { Link } from 'react-router';

import cookie from 'react-cookie';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import selector from './selector';

import checkBusiness from 'utils/checkBusiness';

import { logIn } from 'redux/reducers/user/actions';

import style from '../../Login.scss';

import Title from 'components/Title';

import isEmpty from 'isEmpty';

import {
  SubmissionError,
  Field,
  reduxForm,
  propTypes as formPropTypes,
} from 'redux-form/immutable';

import AppLogo from 'components/AppLogo';

import { intlShape, injectIntl } from 'react-intl';

import messages from 'routes/Login/messages';

import {
  APP_NAME,
  PATH_PASSWORD_RESET,
  PATH_SIGNUP,
  LINK_PRIVACY_POLICY,
  LINK_TERMS_OF_SERVICE,
  LINK_SUPPORT,
} from 'vars';

export class LoginContainer extends React.Component {
  static propTypes = {
    ...formPropTypes,
    intl: intlShape.isRequired,
    actions: T.shape({
      logIn: T.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
  }

  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      const submit = this.props.handleSubmit(this.onSubmit);
      submit();
    }
  }

  async onSubmit(data) {
    const { intl, actions } = this.props;
    const { email, password } = data.toJS();

    try {
      await actions.logIn(
        email,
        /*password = */ isEmpty(password) && __DEV__
          ? process.env.DEV_PASSWORD
          : password,
      );

      if (process.env.NODE_ENV !== 'production') {
        cookie.save('app.logIn', email, { path: '/' });
      }

      // async: Notify busines info
      checkBusiness();
    } catch (e) {
      throw new SubmissionError({ _error: intl.formatMessage(messages.error) });
    }
  }

  _renderForm() {
    const { intl, error, handleSubmit, submitting } = this.props;

    return [
      <h1 className={style.heading}>
        {intl.formatMessage(messages.title, { appName: APP_NAME })}
      </h1>,

      <Field
        name='email'
        component={'input'}
        type='text'
        placeholder={intl.formatMessage(messages.email)}
        className={style.emailFieldControl}
        autoComplete={'off'}
        onKeyDown={this.onKeyDown}
        autoFocus
      />,

      <Field
        name='password'
        component='input'
        type='password'
        placeholder={intl.formatMessage(messages.password)}
        className={style.passwordFieldControl}
        onKeyDown={this.onKeyDown}
      />,

      <div className={style.error}>
        {error && !submitting
          ? <small className={style.formControlFeedback}>
              {intl.formatMessage(messages.error)}
            </small>
          : null}
      </div>,

      <button
        onClick={handleSubmit(this.onSubmit)}
        disabled={submitting}
        className={style.logIn}
        role='button'
      >
        {intl.formatMessage(messages.logIn)}
      </button>,

      <div className={style.passwordReset}>
        <Link className={style.passwordResetButton} to={PATH_PASSWORD_RESET}>
          {intl.formatMessage(messages.passwordReset)}
        </Link>
      </div>,
    ];
  }

  render() {
    const { intl } = this.props;
    return (
      <div className={style.root}>
        <Title
          title={intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}
        />
        <div className={style.center}>
          <Link className={style.logo} to={'/'}>
            <AppLogo width={52} height={52} />
          </Link>
          <div className={style.form}>
            {this._renderForm()}
          </div>
          <div className={style.navSignupWrapper}>
            <span className={style.navbarText}>
              {intl.formatMessage(messages.signupQuestion)}
            </span>{' '}
            <Link className={style.joinButton} to={PATH_SIGNUP}>
              {intl.formatMessage(messages.signUp)}
            </Link>
          </div>
        </div>
        <footer>
          <ul>
            <li className={style.footerLink}>
              <a target='_blank' href={LINK_TERMS_OF_SERVICE}>
                {intl.formatMessage(messages.termsOfService)}
              </a>
            </li>
            <li className={style.footerLink}>
              <a target='_blank' href={LINK_SUPPORT}>
                {intl.formatMessage(messages.support)}
              </a>
            </li>
            <li className={style.footerLink}>
              <a target='_blank' href={LINK_PRIVACY_POLICY}>
                {intl.formatMessage(messages.privacyPolicy)}
              </a>
            </li>
          </ul>
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ logIn }, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

const WithForm = reduxForm({
  form: 'logIn',
});

export default compose(injectIntl, Connect, WithForm)(LoginContainer);
