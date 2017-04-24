import React, { PropTypes as T } from 'react';

import AppBrand from 'components/AppBrand';

import messages from 'routes/Authorization/messages';

import style from 'routes/Authorization/Authorization.scss';

import { injectIntl, intlShape } from 'react-intl';

function Header({ intl, onLogOut }) {
  return (
    <nav className={style.navbar}>
      <AppBrand/>
      <div className={style.menu}>
        <a className={style.logoutLink} onClick={onLogOut}>{intl.formatMessage(messages.logOut)}</a>
      </div>
    </nav>
  );
}

Header.propTypes = {
  intl     : intlShape.isRequired,
  onLogOut : T.func.isRequired,
};

export default injectIntl(Header);

