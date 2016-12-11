import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import cookie from 'react-cookie';

import compose from 'recompose/compose';

import invariant from 'invariant';

import Parse from 'parse';

import isEmpty from 'isEmpty';

import { login } from 'redux/reducers/user/actions';

import selector from './selector';

import validations from '../validations';

import style from '../Signup.scss';

import Title from 'components/Title';

import { SubmissionError, Field, reduxForm, propTypes as formPropTypes } from 'redux-form/immutable';

import {
  intlShape,
  injectIntl,
} from 'react-intl';

import messages from '../messages';

import Header from '../components/Header';

import EmailField from '../components/EmailField';
import PasswordField from '../components/PasswordField';
import PasswordConfirmationField from '../components/PasswordConfirmationField';
import ReCAPTCHAField from '../components/ReCAPTCHAField';

import MUTATION from './signUp.mutation.graphql';

import { APP_NAME } from 'env';

class SignupContainer extends React.Component {
  static propTypes = {
    ...formPropTypes,
    intl            : intlShape.isRequired,
    client          : T.shape({
      mutate: T.func.isRequired,
    }),
    isAuthenticated : T.bool.isRequired,
    actions         : T.shape({
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.onSubmit  = this.onSubmit.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
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
    const { intl } = this.props;

    const { data: { signUp: { user, errors } } } = await this.props.client.mutate({
      mutation  : MUTATION,
      variables : { info: {
        email                : data.get('email'),
        password             : data.get('password'),
        passwordConfirmation : data.get('passwordConfirmation'),
        recaptcha            : data.get('recaptcha'),
      } },
    });

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }

    invariant(user, '`user` must be defined at this point.');

    try {
      const parseObject = await Parse.User.logIn(user.username, data.get('password'));
      if (parseObject) {
        const loggedInUser = { id: parseObject.id, ...parseObject.toJSON() };
        cookie.save('app.login', loggedInUser.username);
        this.props.actions.login(loggedInUser);
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
      intl, handleSubmit, submitting, invalid,
    } = this.props;

    return [
      <h2 className={ style.heading }>{intl.formatMessage(messages.title)}</h2>,

      <Field
        name="email"
        component={EmailField}
        placeholder={intl.formatMessage(messages.email)}
        onKeyDown={this.onKeyDown} />,

      <Field
        name="password"
        component={PasswordField}
        placeholder={intl.formatMessage(messages.password)}
        onKeyDown={this.onKeyDown} />,

      <Field
        name="passwordConfirmation"
        component={PasswordConfirmationField}
        placeholder={intl.formatMessage(messages.passwordConfirmation)}
        onKeyDown={this.onKeyDown} />,

      <Field
        name={'recaptcha'}
        component={ReCAPTCHAField} />,

      <button onClick={handleSubmit(this.onSubmit)} disabled={submitting || invalid} className={ 'btn btn-primary btn-block' }>
        {intl.formatMessage(messages.signUp)}
      </button>,

    ];
  }

  render() {
    const { intl } = this.props;
    return (
      <div className={style.root}>
        <Title title={intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}/>
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
  form: 'signup',
  ...validations,
});

export default compose(
  injectIntl,
  withRouter,
  withApollo,
  Connect,
  WithForm,
)(SignupContainer);

