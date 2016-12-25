import React, { PropTypes as T } from 'react';
import { Link, withRouter } from 'react-router';
import { withApollo } from 'react-apollo';

import {compose, bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import isEmpty from 'isEmpty';

import selector from './selector';

import validations from '../../validations';

import style from '../../PasswordReset.scss';

import Title from 'components/Title';

import AppLogo from 'components/AppLogo';

import { SubmissionError, Field, reduxForm, propTypes as formPropTypes } from 'redux-form/immutable';

import {
  intlShape,
  injectIntl,
} from 'react-intl';

import messages from '../../messages';

import MUTATION from './passwordReset.mutation.graphql';

import NotifySuccess from '../../components/NotifySuccess';

import EmailField from '../../components/EmailField';

import { APP_NAME } from 'vars';

export class PasswordResetContainer extends React.Component {
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
    const { data: { passwordReset: { errors } } } = await this.props.client.mutate({
      mutation  : MUTATION,
      variables : { info: {
        email      : data.get('email'),
      } },
    });

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }

    return;
  }

  _renderForm() {
    const {
      intl, handleSubmit, submitting, invalid,
    } = this.props;

    return [
      <Link className={style.logo} to={'/'}>
        <AppLogo width={48} height={48}/>
      </Link>,

      <h5 className={ style.heading }>{intl.formatMessage(messages.title)}</h5>,

      <div className={ style.subheading }>{intl.formatMessage(messages.introText)}</div>,

      <Field
        name='email'
        component={EmailField}
        placeholder={intl.formatMessage(messages.email)}
        onKeyDown={this.onKeyDown} />,

      <button onClick={handleSubmit(this.onSubmit)} disabled={submitting || invalid} className={style.passwordResetButton}>
        {intl.formatMessage(messages.passwordReset)}
      </button>,

    ];
  }

  render() {
    const { intl, submitSucceeded, form } = this.props;
    return (
      <div className={style.root}>
        <Title title={intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}/>
        {submitSucceeded ? <NotifySuccess form={form}/> : null}
        <div className={style.centerContent}>
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
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

const WithForm = reduxForm({
  form: 'passwordReset',
  ...validations,
});

export default compose(
  injectIntl,
  withRouter,
  withApollo,
  Connect,
  WithForm,
)(PasswordResetContainer);

