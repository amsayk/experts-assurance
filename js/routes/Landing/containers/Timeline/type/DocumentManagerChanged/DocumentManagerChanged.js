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

import { PersonIcon } from 'components/icons/MaterialIcons';

// import ProfilePic from 'components/Profile/ProfilePic';

const TYPE = 'DOCUMENT_MANAGER_CHANGED';

const ICON_WRAPPER_STYLE = {
  color: 'rgb(0, 0, 0)',
  backgroundColor: 'rgb(255, 64, 128)',
  userSelect: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontStyle: 'normal',
  fontVariant: 'normal',
  fontWeight: 'bolder',
  fontStretch: 'normal',
  fontSize: 13,
  lineHeight: 'normal',
  fontFamily: 'Helvetica, Arial, sans-serif',
  borderRadius: '50%',
  textTransform: 'uppercase',
  height: 24,
  width: 24,
};

export default function DocumentManagerChanged({ intl, doc, user, now : timestamp, metadata }, { currentUser }) {
  return (
    <article className={cx(style.feedItem, style[TYPE])}>

      <div style={ICON_WRAPPER_STYLE} className={style.profilePic}>
        {/* <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}> */}
        {/*   <ProfilePic */}
        {/*     user={user} */}
        {/*     size={24} */}
        {/*   /> */}
        {/* </Link> */}
        <PersonIcon size={18}/>
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

