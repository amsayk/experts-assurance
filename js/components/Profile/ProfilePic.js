import React, { PropTypes as T } from 'react';

import Avatar from 'react-avatar';

const ProfilePic = ({ user, size, ...props }) => {
  if (user) {
    if (user.displayName) {
      return (
        <Avatar round size={size} name={user.displayName} textSizeRatio={1.75} {...props}/>
      );
    } else {
      return (
        <Avatar round size={size} value={'@'} textSizeRatio={1.75} {...props}/>
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

