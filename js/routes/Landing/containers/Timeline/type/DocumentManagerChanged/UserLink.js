import React from 'react';
import { Link } from 'react-router';

import { compose } from 'redux';

import style from 'routes/Landing/styles';

import DataLoader from 'routes/Landing/DataLoader';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

class UserLink extends React.Component {
  render() {
    const { user, loading } = this.props;

    if (loading === true || (typeof loading === 'undefined')) {
      return (
        <div
          className={style.placeholder}
          style={{ width: 125, height: 23 }}
        >
        </div>
      );
    }

    return (
      <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
        {user.displayName}
      </Link>
    );
  }
}

export default compose(
  DataLoader.user,
)(UserLink);

