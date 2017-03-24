import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
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
  FormattedMessage,
} from 'react-intl';

import messages from '../../messages';

import MUTATION from './passwordReset.mutation.graphql';

import EmailField from '../../components/EmailField';

import {
  APP_NAME,
  LINK_PRIVACY_POLICY,
  LINK_TERMS_OF_SERVICE,
  LINK_SUPPORT,
} from 'vars';

export class PasswordResetContainer extends React.Component {
  static contextTypes = {
    snackbar: T.shape({
      show: T.func.isRequired,
    }),
  };

  static propTypes = {
    ...formPropTypes,
    intl            : intlShape.isRequired,
    client          : T.shape({
      mutate: T.func.isRequired,
    }),
    actions         : T.shape({
    }).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.onSubmit  = this.onSubmit.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
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

    const { snackbar } = this.context;
    if (snackbar) {
      const values = {
        email: <strong className={''}>{data.get('email')}</strong>,
      };
      snackbar.show({
        message: (
          <FormattedMessage
            {...messages.emailSent}
            values={values}
          />
        ),
        duration: 9 * 1000,
      });
    }
  }

  _renderForm() {
    const {
      intl, handleSubmit, submitting, invalid,
    } = this.props;

    return [
      <h5 className={ style.heading }>{intl.formatMessage(messages.title)}</h5>,

      <div className={ style.subheading }>{intl.formatMessage(messages.introText)}</div>,

      <Field
        name='email'
        component={EmailField}
        placeholder={intl.formatMessage(messages.email)}
        onKeyDown={this.onKeyDown} />,

      <button onClick={handleSubmit(this.onSubmit)} disabled={submitting || invalid} className={style.passwordResetButton} role='button'>
        {intl.formatMessage(messages.passwordReset)}
      </button>,

    ];
  }

  render() {
    const { intl } = this.props;
    return (
      <div className={style.root}>
        <Title title={intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}/>
        <div className={style.center}>
          <Link className={style.logo} to={'/'}>
            <AppLogo width={52} height={52}/>
          </Link>
          <div className={style.form}>
            {this._renderForm()}
          </div>
        </div>
        <footer>
          <ul>
            <li className={style.footerLink}>
              <a target='_blank' href={LINK_TERMS_OF_SERVICE}>{intl.formatMessage(messages.termsOfService)}</a>
            </li>
            <li className={style.footerLink}>
              <a target='_blank' href={LINK_SUPPORT}>{intl.formatMessage(messages.support)}</a>
            </li>
            <li className={style.footerLink}>
              <a target='_blank' href={LINK_PRIVACY_POLICY}>{intl.formatMessage(messages.privacyPolicy)}</a>
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
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

const WithForm = reduxForm({
  form: 'passwordReset',
  ...validations,
});

export default compose(
  injectIntl,
  withApollo,
  Connect,
  WithForm,
)(PasswordResetContainer);

