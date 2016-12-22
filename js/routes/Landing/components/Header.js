import React, { PropTypes as T } from 'react';

import AppBrand from 'components/AppBrand';

import messages from '../messages';

import style from '../Landing.scss';

import cx from 'classnames';

import { injectIntl, intlShape } from 'react-intl';

function Header({ intl, onLogOut }) {
  return (
    <nav className={cx(style.navbar, 'navbar navbar-full navbar-light')}>
      <AppBrand/>
      <form className='form-inline float-lg-right'>
        <a className={'btn btn-link'} onClick={onLogOut}>{intl.formatMessage(messages.logOut)}</a>
      </form>
    </nav>
  );
}

Header.propTypes = {
  intl     : intlShape.isRequired,
  onLogOut : T.func.isRequired,
};

export default injectIntl(Header);

