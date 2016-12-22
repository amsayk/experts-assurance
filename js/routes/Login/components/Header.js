import React from 'react';
import { Link } from 'react-router';

import AppBrand from 'components/AppBrand';

import messages from '../messages';

import style from '../Login.scss';

import cx from 'classnames';

import { injectIntl, intlShape } from 'react-intl';

import { PATH_SIGNUP } from 'vars';

function Header({ intl }) {
  return (
    <nav className={cx(style.navbar, 'navbar navbar-full navbar-light')}>
      <AppBrand/>
      <form className='form-inline float-lg-right'>
        <span className='navbar-text hint-block'>
          {intl.formatMessage(messages.signupQuestion)}
        </span>{' '}
        <Link className={ 'btn btn-outline-danger align-top' } to={PATH_SIGNUP}>
          {intl.formatMessage(messages.signUp)}
        </Link>
      </form>
    </nav>
  );
}

Header.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Header);

