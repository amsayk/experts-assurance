import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import AppBrand from 'components/AppBrand';

import messages from '../messages';

import style from '../Landing.scss';

import { injectIntl, intlShape } from 'react-intl';

import Avatar from 'react-avatar';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import { PATH_SETTINGS_BASE } from 'vars';

function Header({ intl, user, onLogOut }) {
  let ProfilePic;
  if (user) {
    if (user.displayName) {
      ProfilePic = () => <Avatar round size={32} name={user.displayName} textSizeRatio={1.75}/>;
    } else {
      ProfilePic = () => <Avatar round size={32} value={'@'}/>;
    }
  }
  return (
    <nav className={style.navbar}>
      <div className={style.navbarNav}>
        <AppBrand/>
        <div className={style.logoutNav}>
          <Dropdown pullRight>
            <Dropdown.Toggle className={style.avatar}>
              {ProfilePic ? <ProfilePic/> : null}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem componentClass={Link} to={PATH_SETTINGS_BASE}>
                {intl.formatMessage(messages.manageAccount)}
              </MenuItem>
              <MenuItem divider/>
              <MenuItem onClick={onLogOut}>
                {intl.formatMessage(messages.logOut)}
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}

Header.propTypes = {
  intl     : intlShape.isRequired,
  onLogOut : T.func.isRequired,
  user     : T.shape({
    displayName: T.string,
  }),
};

export default injectIntl(Header);

