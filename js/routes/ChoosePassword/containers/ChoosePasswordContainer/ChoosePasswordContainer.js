import React from 'react';
import T from 'prop-types';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import selector from './selector';

import validations from '../../validations';

import style from '../../ChoosePassword.scss';

import Title from 'components/Title';

import AppLogo from 'components/AppLogo';

import {
  SubmissionError,
  Field,
  reduxForm,
  propTypes as formPropTypes,
} from 'redux-form/immutable';

import { intlShape, injectIntl } from 'react-intl';

import {
  APP_NAME,
  LINK_PRIVACY_POLICY,
  LINK_TERMS_OF_SERVICE,
  LINK_SUPPORT,
} from 'vars';

import messages from '../../messages';

import PasswordField from '../../components/PasswordField';

export class ChoosePasswordContainer extends React.Component {
  static propTypes = {
    ...formPropTypes,
    token: T.string.isRequired,
    action: T.string.isRequired,
    username: T.string.isRequired,
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
    this._setFormRef = this._setFormRef.bind(this);
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
    const { intl, handleSubmit, submitting, invalid } = this.props;

    return [
      <h1 className={style.heading}>
        {intl.formatMessage(messages.title)}
      </h1>,

      <Field
        name='new_password'
        component={PasswordField}
        placeholder={intl.formatMessage(messages.password)}
        onKeyDown={this.onKeyDown}
      />,

      <button
        onClick={handleSubmit(this.onSubmit)}
        disabled={submitting || invalid}
        className={style.changePasswordButton}
        role='button'
      >
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
        <Title
          title={intl.formatMessage(messages.pageTitle, { appName: APP_NAME })}
        />
        <div className={style.center}>
          <Link className={style.logo} to={'/'}>
            <AppLogo width={52} height={52} />
          </Link>
          <form
            ref={this._setFormRef}
            action={action}
            className={style.form}
            method={'POST'}
          >
            <input name='utf-8' type='hidden' value='✓' />
            <input name='username' value={username} type='hidden' />
            <input name='token' value={token} type='hidden' />
            {this._renderForm()}
          </form>
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
  return { actions: bindActionCreators({}, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

const WithForm = reduxForm({
  form: 'choosePassword',
});

export default compose(injectIntl, Connect, WithForm)(ChoosePasswordContainer);
