import React from 'react';
import T from 'prop-types';
import { Link, withRouter } from 'react-router';
import { withApollo } from 'react-apollo';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import checkBusiness from 'utils/checkBusiness';

import cookie from 'react-cookie';

import invariant from 'invariant';

import isEmpty from 'isEmpty';

import { logIn } from 'redux/reducers/user/actions';

import selector from './selector';

import validations from '../../validations';

import style from '../../Signup.scss';

import Title from 'components/Title';

import {
  SubmissionError,
  Field,
  reduxForm,
  propTypes as formPropTypes,
} from 'redux-form/immutable';

import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import messages from '../../messages';

import EmailField from '../../components/EmailField';
import DisplayNameField from '../../components/DisplayNameField';
import PasswordField from '../../components/PasswordField';
import ReCAPTCHAField from '../../components/ReCAPTCHAField';

import MUTATION from './signUp.mutation.graphql';

import {
  PATH_LOGIN,
  APP_NAME,
  LINK_PRIVACY_POLICY,
  LINK_TERMS_OF_SERVICE,
  ENABLE_RECAPTCHA,
} from 'vars';

import AppLogo from 'components/AppLogo';

export class SignupContainer extends React.Component {
  static propTypes = {
    ...formPropTypes,
    intl: intlShape.isRequired,
    client: T.shape({
      mutate: T.func.isRequired,
    }),
    actions: T.shape({
      logIn: T.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    initialValues: {
      displayName: null,
    },
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
    try {
      await validations.asyncValidate(data);
    } catch (e) {
      throw new SubmissionError(e);
    }

    const { intl, actions } = this.props;

    const {
      data: { signUp: { user, errors } },
    } = await this.props.client.mutate({
      mutation: MUTATION,
      variables: {
        info: {
          displayName: data.get('displayName'),
          email: data.get('email'),
          password: data.get('password'),
          passwordConfirmation: data.get('passwordConfirmation'),
          recaptcha: data.get('recaptcha'),
        },
      },
    });

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }

    invariant(user, '`user` must be defined at this point.');

    try {
      await actions.logIn(user.username, data.get('password'));

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
    const { intl, handleSubmit, submitting, invalid } = this.props;

    return [
      <h1 className={style.heading}>
        {intl.formatMessage(messages.title, { appName: APP_NAME })}
      </h1>,

      <p className={style.tagLine}>
        {intl.formatMessage(messages.tagLine)}
      </p>,

      <Field
        name='displayName'
        component={DisplayNameField}
        placeholder={intl.formatMessage(messages.displayName)}
        onKeyDown={this.onKeyDown}
      />,

      <Field
        name='email'
        component={EmailField}
        placeholder={intl.formatMessage(messages.email)}
        onKeyDown={this.onKeyDown}
      />,

      <Field
        name='password'
        component={PasswordField}
        placeholder={intl.formatMessage(messages.password)}
        onKeyDown={this.onKeyDown}
      />,

      ENABLE_RECAPTCHA
        ? <Field name={'recaptcha'} component={ReCAPTCHAField} />
        : null,

      <p className={style.tos}>
        <FormattedMessage
          {...messages.tos}
          values={{
            action: intl.formatMessage(messages.signUp),
            termsOfService: (
              <a target='_blank' href={LINK_TERMS_OF_SERVICE}>
                {intl.formatMessage(messages.termsOfService)}
              </a>
            ),
            privacyPolicy: (
              <a target='_blank' href={LINK_PRIVACY_POLICY}>
                {intl.formatMessage(messages.privacyPolicy)}
              </a>
            ),
          }}
        />
      </p>,

      <button
        onClick={handleSubmit(this.onSubmit)}
        disabled={submitting || invalid}
        className={style.join}
        role='button'
      >
        {intl.formatMessage(messages.signUp)}
      </button>,
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
          <div className={style.navLoginWrapper}>
            <span className={style.navbarText}>
              {intl.formatMessage(messages.logInQuestion)}
            </span>{' '}
            <Link className={style.logIn} to={PATH_LOGIN}>
              {intl.formatMessage(messages.logIn)}
            </Link>
          </div>
        </div>
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
  form: 'signup',
  // validate: validations.validate,
});

export default compose(injectIntl, withRouter, withApollo, Connect, WithForm)(
  SignupContainer,
);
