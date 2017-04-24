import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import {
  PATH_CASES_CASE,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
} from 'vars';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import ProfilePic from 'components/Profile/ProfilePic';

const TYPE = 'DOCUMENT_RESTORED';

export default function DocumentRestored({ intl, doc, user, timestamp, metadata }, { currentUser }) {
  return (
    <article className={cx(style.feedItem, style[TYPE])}>

      <div className={style.profilePic}>
        <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
          <ProfilePic
            user={user}
            size={24}
          />
        </Link>
      </div>

      <div className={style.entry}>
        <div className={style.title}>
          <Link to={PATH_CASES_CASE + '/' + doc.id}>
            Restoration de dossier <b>{doc.refNo}</b>
          </Link>
        </div>
        <div className={style.info}>
          <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
            {user.displayName}
          </Link> ·{' '}
          <time title={intl.formatDate(timestamp)} dateTime={new Date(new Date(timestamp)).toISOString()}>
            {intl.formatRelative(new Date(timestamp))}
          </time>
        </div>
      </div>
    </article>
  );
}

DocumentRestored.contextTypes = {
  currentUser : T.object.isRequired,
};

