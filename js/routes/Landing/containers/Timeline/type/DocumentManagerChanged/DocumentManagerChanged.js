import React, { PropTypes as T } from 'react';

import { Link } from 'react-router';

import {
  PATH_CASES_CASE,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
} from 'vars';

import UserLink from './UserLink';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import ProfilePic from 'components/Profile/ProfilePic';

const TYPE = 'DOCUMENT_MANAGER_CHANGED';

export default function DocumentManagerChanged({ intl, doc, user, timestamp, metadata }, { currentUser }) {
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
            Dossier <b>{doc.refNo}</b> a un nouveau gestionnaire
          </Link>
        </div>
        <div className={style.desc}>
          {metadata.fromManager ? [
            <span style={{ marginRight: 5 }}>
              <UserLink id={metadata.fromManager} docLoading={false}/>
            </span>,
            <span style={{ marginRight: 5 }}> → </span>
          ] : null}
          <span>
            <UserLink id={metadata.toManager} docLoading={false}/>
          </span>
        </div>
        <div className={style.info}>
          <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
            {user.displayName}
          </Link> ·{' '}
          <time title={intl.formatDate(timestamp)} dateTime={new Date(timestamp).toISOString()}>
            {intl.formatRelative(timestamp)}
          </time>
        </div>
      </div>
    </article>
  );
}

DocumentManagerChanged.contextTypes = {
  currentUser : T.object.isRequired,
};

