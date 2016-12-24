import React from 'react';
import { Link } from 'react-router';

import AppBrand from 'components/AppBrand';

import messages from '../messages';

import style from '../Login.scss';

import { injectIntl, intlShape } from 'react-intl';

import { PATH_SIGNUP } from 'vars';

function Header({ intl }) {
  return (
    <nav className={style.navbar}>
      <div className={style.navbarNav}>
        <AppBrand/>
        <form className={style.navSignupWrapper}>
          <span className={style.navbarText}>
            {intl.formatMessage(messages.signupQuestion)}
          </span>{' '}
          <Link className={style.joinButton} to={PATH_SIGNUP}>
            {intl.formatMessage(messages.signUp)}
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

