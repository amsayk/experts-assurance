import React, { PropTypes as T } from 'react';

import { Link } from 'react-router';

import {
  PATH_CASES_CASE,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
} from 'vars';

import {
  // UnknownIcon,
  // WatchIcon,
  DoneIcon,
  CanceledIcon,

  // CancelIcon,
} from 'components/icons/MaterialIcons';

import style from 'routes/Landing/styles';

import cx from 'classnames';

// import ProfilePic from 'components/Profile/ProfilePic';

const TYPE = 'DOCUMENT_STATE_CHANGED';

const ICON_WRAPPER_STYLE_CLOSED = {
  color: 'rgb(255, 255, 255)',
  backgroundColor: 'rgb(33, 150, 243)',
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

const ICON_WRAPPER_STYLE_CANCELED = {
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

// function getState(state, stateText, icon) {
//   return [
//     // <span className={cx(style[state], style.docStateToggle)}>
//     //   {icon}
//     // </span>,
//     <span className={style.text} style={{
//       // textTransform: 'uppercase',
//       marginRight: 5,
//       border: '1px solid #000',
//       borderRadius: '15%',
//       padding: '1px 4px',
//       marginLeft: 5,
//     }}>
//     {stateText}
//   </span>,
//   ];
// }

// const STATES = {
//   // PENDING  : getState('PENDING',  'En attente',  <UnknownIcon  size={12}/>),
//   OPEN     : getState('OPEN',     'En cours',    <WatchIcon    size={12}/>),
//   CLOSED   : getState('CLOSED',   'Clos',        <DoneIcon     size={12}/>),
//   CANCELED : getState('CANCELED', 'Annulé',      <CanceledIcon size={12}/>),
// };

export default function DocumentStateChanged({ intl, doc, user, timestamp, metadata }, { currentUser }) {
  return (
    <article className={cx(style.feedItem, style[TYPE])}>

      <div style={metadata.toState === 'CLOSED' ? ICON_WRAPPER_STYLE_CLOSED : ICON_WRAPPER_STYLE_CANCELED} className={style.profilePic}>
        {/* <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}> */}
          {/*   <ProfilePic */}
            {/*     user={user} */}
            {/*     size={24} */}
            {/*   /> */}
          {/* </Link> */}
        {metadata.toState === 'CLOSED' ? <DoneIcon size={18}/> : <CanceledIcon size={18}/>}
      </div>

      <div className={style.entry}>
        <div className={style.title}>
          <Link to={PATH_CASES_CASE + '/' + doc.id}>
            {(() => {
              if (metadata.toState === 'CLOSED') {
                return (
                  <span>
                    Dossier <b>{doc.refNo}</b> a été clôturé
                  </span>
                );
              } else {
                return (
                  <span>
                    Dossier <b>{doc.refNo}</b> a été annulé
                  </span>
                );
              }
            })()}
          </Link>
        </div>
        {/* <div className={style.desc}> */}
          {/*   <span style={{ marginRight: 5 }}>{STATES[metadata.fromState]}</span> */}
          {/*   <span style={{ marginRight: 5 }}> → </span> */}
          {/*   <span>{STATES[metadata.toState]}</span> */}
          {/* </div> */}
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

DocumentStateChanged.contextTypes = {
  currentUser : T.object.isRequired,
};

