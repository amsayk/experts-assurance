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
      ProfilePic = (props) => <Avatar round size={32} name={user.displayName} textSizeRatio={1.75} {...props}/>;
    } else {
      ProfilePic = (props) => <Avatar round size={32} value={'@'} textSizeRatio={1.75} {...props}/>;
    }
  }
  return (
    <nav className={style.navbar}>
      <AppBrand/>
      <div className={style.menu}>
        <Dropdown pullRight>
          <Dropdown.Toggle className={style.avatar} bsStyle={'link'}>
            {ProfilePic ? <ProfilePic/> : null}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem componentClass={Profile} user={user} ProfilePic={ProfilePic}/>
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

const Profile = ({ user, ProfilePic }) => (
  <div className={style.profile}>
    <div className={style.profileAvatar}>
      {ProfilePic ? <ProfilePic round={false} size={48}/> : null}
    </div>
    <div className={ style.profileInfo }>
      <div className={ style.profileName }>
        {user && user.displayName}
      </div>
      <div className={ style.profileEmail }>
        {user && user.email}
      </div>
    </div>
  </div>
);

export default injectIntl(Header);

