import React from 'react';
import { compose } from 'redux';
import { Link } from 'react-router';

import ActivityIndicator from 'components/ActivityIndicator';

import DataLoader from 'routes/Settings/containers/Business/User/DataLoader';

import style from 'routes/Settings/styles';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

function ByUser({ loading, selectedUser : user }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <span>
        Autorisé par{' '}
      </span>
      {loading ? <ActivityIndicator size='small' /> : <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
        <span style={{ marginLeft: 5, display: 'flex', alignItems: 'center' }} className={style.text}>
          {user.displayName}
        </span>
      </Link>}
    </span>
  );
}

export default compose(
  DataLoader.user,
)(ByUser);

