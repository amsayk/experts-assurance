import React, { PropTypes as T } from 'react';
import { Link, withRouter } from 'react-router';

import Parse from 'parse';

import cookie from 'react-cookie';

import {compose, bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import selector from './selector';

import { login } from 'redux/reducers/user/actions';

import cx from 'classnames';

import style from '../Login.scss';

import Title from 'components/Title';

import isEmpty from 'isEmpty';

import { SubmissionError, Field, reduxForm, propTypes as formPropTypes } from 'redux-form/immutable';

import {
  intlShape,
  injectIntl,
} from 'react-intl';

import messages from '../messages';

import Header from '../components/Header';

import NotifyPasswordResetSuccess from 'components/notifications/NotifyPasswordResetSuccess';
import NotifyInvalidLink from 'components/notifications/NotifyInvalidLink';

import {
  APP_NAME,
  PATH_INVALID_LINK,
  PATH_PASSWORD_RESET_SUCCESS,
  PATH_PASSWORD_RESET,
} from 'vars';

class LoginContainer extends React.Component {
  static propTypes = {
    ...formPropTypes,
    intl            : intlShape.isRequired,
    isAuthenticated : T.bool.isRequired,
    redirect        : T.string.isRequired,
    actions         : T.shape({
      login : T.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.onSubmit  = this.onSubmit.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
  }

  componentWillMount() {
    const { isAuthenticated, redirect, router } = this.props;
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, redirect } = nextProps;
    const { isAuthenticated: wasAuthenticated, router } = this.props;

    if (!wasAuthenticated && isAuthenticated) {
      router.replace(redirect);
    }
  }

  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      const submit = this.props.handleSubmit(this.onSubmit);
      submit();
    }
  }

  async onSubmit(credentials) {
    const { intl } = this.props;
    const { email, password } = credentials.toJS();

    try {
      const parseObject = await Parse.User.logIn(
        email, /*password = */isEmpty(password) && __DEV__ ? process.env.DEV_PASSWORD : password);
      if (parseObject) {
        const user = { id: parseObject.id, ...parseObject.toJSON() };
        cookie.save('app.login', email);
        this.props.actions.login(user);
        this.props.router.push('/');
      } else {
        throw new SubmissionError({ _error: intl.formatMessage(messages.error) });
      }
    } catch (e) {
      throw new SubmissionError({ _error: intl.formatMessage(messages.error) });
    }
  }

  _renderForm() {
    const {
      intl, error, handleSubmit, submitting,
    } = this.props;

    return [
      <h2 className={ style.heading }>{intl.formatMessage(messages.title)}</h2>,

      <Field
        name="email"
        component={'input'}
        type="text"
        placeholder={intl.formatMessage(messages.email)}
        className={'form-control'}
        autoComplete={'off'}
        onKeyDown={this.onKeyDown}
        autoFocus />,

      <Field
        name="password"
        component="input"
        type="password"
        placeholder={intl.formatMessage(messages.password)}
        className={'form-control'}
        onKeyDown={this.onKeyDown}
      />,

      <div className={cx({[style.error]: true, 'has-danger': true })}>

        {error && !submitting ?
            <small className={'form-control-feedback'}>{intl.formatMessage(messages.error)}</small>
            : null}

          </div>,

      <button onClick={handleSubmit(this.onSubmit)} disabled={submitting} className={ 'btn btn-primary btn-block' }>
        {intl.formatMessage(messages.login)}
      </button>,

      <div className={ style.password_reset }>
        <Link className={ 'btn btn-link' } to={PATH_PASSWORD_RESET}>{intl.formatMessage(messages.password_reset)}</Link>
      </div>,
    ];
  }

  render() {
    const { intl, notify } = this.props;

    let Notification = null;
    if (notify === PATH_INVALID_LINK) {
      Notification = NotifyInvalidLink;
    } else if (notify === PATH_PASSWORD_RESET_SUCCESS) {
      Notification = NotifyPasswordResetSuccess;
    }
    return (
      <div className={style.root}>
        <Title title={intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}/>
        {Notification ? <Notification/> : null}
        <Header/>
        <div className="center-content">
          <div className={style.form}>
            {this._renderForm()}
          </div>
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
  return {actions: bindActionCreators({ login }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

const WithForm = reduxForm({
  form: 'login',
});

export default compose(
  injectIntl,
  withRouter,
  Connect,
  WithForm,
)(LoginContainer);

