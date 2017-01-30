import React, { PropTypes as T } from 'react';

import style from './Profile.scss';

import ProfilePic from './ProfilePic';

import Dropdown from 'components/bootstrap/Dropdown';

const ProfileButton = ({ user, size, children }) => (
  <div className={style.menu}>
    <Dropdown pullRight>
      <Dropdown.Toggle className={style.avatar}>
        <ProfilePic user={user} size={size}/>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {children}
      </Dropdown.Menu>
    </Dropdown>
  </div>
);

ProfileButton.propTypes = {
  size    : T.number.isRequired,
  chidren : T.arrayOf(T.element.isRequired).isRequired,
  user    : T.shape({
    displayName: T.string.isRequired,
    email: T.string.isRequired,
  }),
};

ProfileButton.defaultProps = {
  size : 32,
};

export default ProfileButton;

