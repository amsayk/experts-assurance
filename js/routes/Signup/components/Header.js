import React from 'react';
import { Link } from 'react-router';

import { PATH_LOGIN } from 'vars';

import AppBrand from 'components/AppBrand';

import messages from '../messages';

import style from '../Signup.scss';

import { injectIntl, intlShape } from 'react-intl';

function Header({ intl }) {
  return (
    <nav className={style.navbar}>
      <div className={style.navbarNav}>
        <AppBrand/>
        <form className={style.navLoginWrapper}>
          <span className={style.navbarText}>
            {intl.formatMessage(messages.loginQuestion)}
          </span>{' '}
          <Link className={style.logIn} to={PATH_LOGIN}>
            {intl.formatMessage(messages.login)}
          </Link>
        </form>
      </div>
    </nav>
  );
}

Header.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Header);

