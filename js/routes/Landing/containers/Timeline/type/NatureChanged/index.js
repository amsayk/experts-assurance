import React from 'react';
import T from 'prop-types';
import { Link } from 'react-router';

import {
  PATH_CASES_CASE,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
} from 'vars';

import { PencilIcon, TrashIcon } from 'components/icons/MaterialIcons';

import style from 'routes/Landing/styles';

import cx from 'classnames';

const TYPE = 'NATURE_CHANGED';

const ICON_WRAPPER_STYLE = {
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

export default function NatureChanged(
  { intl, doc, user, now: timestamp, metadata },
  { currentUser },
) {
  return (
    <article className={cx(style.feedItem, style[TYPE])}>
      <div style={ICON_WRAPPER_STYLE} className={style.profilePic}>
        {metadata.deletion ? <TrashIcon size={18} /> : <PencilIcon size={18} />}
      </div>

      <div className={style.entry}>
        <div className={style.title}>
          <Link to={PATH_CASES_CASE + '/' + doc.id}>
            Nature de <b>{doc.refNo}</b>
          </Link>
        </div>
        {/* <div className={style.desc}> */}
        {/*   {STATES[metadata.state]} */}
        {/* </div> */}
        <div className={style.info}>
          <Link
            to={
              PATH_SETTINGS_BASE +
              '/' +
              PATH_SETTINGS_BUSINESS_USER +
              '/' +
              user.id
            }
          >
            {user.displayName}
          </Link>{' '}
          ·{' '}
          <time
            title={intl.formatDate(timestamp)}
            dateTime={new Date(timestamp).toISOString()}
          >
            {intl.formatRelative(new Date(timestamp))}
          </time>
        </div>
      </div>
    </article>
  );
}

NatureChanged.contextTypes = {
  currentUser: T.object.isRequired,
};