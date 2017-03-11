import React, { PropTypes as T } from 'react';

import Avatar from 'components/Avatar';

function getInitials(name) {
  // const parts = name.split(' ');
  // let initials = '';
  // for(let i = 0 ; i < parts.length ; i++) {
  //   initials += parts[i].substr(0, 1).toUpperCase();
  // }
  // return initials;

  return name[0];
}

const ProfilePic = ({ user, size, ...props }) => {
  if (user) {
    if (user.displayName) {
      return (
        <Avatar size={size} textSizeRatio={1.75} {...props}>
          {getInitials(user.displayName)}
        </Avatar>
      );
    } else {
      return (
        <Avatar size={size} textSizeRatio={1.75} {...props}>
          @
        </Avatar>
      );
    }
  }
  return null;
};

ProfilePic.propTypes = {
  user : T.shape({
    displayName: T.string.isRequired,
    email: T.string.isRequired,
  }),
  size : T.number.isRequired,
};

ProfilePic.defaultProps = {
  size : 32,
};

export default ProfilePic;

