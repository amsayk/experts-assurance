import React, { PropTypes as T } from 'react';

import AppBrand from 'components/AppBrand';

import messages from '../messages';

import style from '../Landing.scss';

import cx from 'classnames';

import { injectIntl, intlShape } from 'react-intl';

function Header({ intl, onLogOut }) {
  return (
    <nav className={style.navbar}>
      <AppBrand/>
      <form className={style.logoutWrapper}>
        <a className={style.logout} onClick={onLogOut}>{intl.formatMessage(messages.logOut)}</a>
      </form>
    </nav>
  );
}

Header.propTypes = {
  intl     : intlShape.isRequired,
  onLogOut : T.func.isRequired,
};

export default injectIntl(Header);

