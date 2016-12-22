import React from 'react';
import { Link } from 'react-router';

import { PATH_LOGIN } from 'vars';

import AppBrand from 'components/AppBrand';

import messages from '../messages';

import style from '../Signup.scss';

import cx from 'classnames';

import { injectIntl, intlShape } from 'react-intl';

function Header({ intl }) {
  return (
    <nav className={cx(style.navbar, 'navbar navbar-full navbar-light')}>
      <AppBrand/>
      <form className='form-inline float-lg-right'>
        <span className='navbar-text hint-block'>
          {intl.formatMessage(messages.loginQuestion)}
        </span>{' '}
        <Link className={ 'btn btn-outline-success align-top' } to={PATH_LOGIN}>
          {intl.formatMessage(messages.login)}
        </Link>
      </form>
    </nav>
  );
}

Header.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Header);

