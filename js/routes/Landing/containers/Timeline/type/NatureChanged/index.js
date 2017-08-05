import React from 'react';
import T from 'prop-types';
import { Link } from 'react-router';

import { diffChars } from 'diff';

import {
  PATH_CASES_CASE,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
} from 'vars';

import { PencilIcon, TrashIcon } from 'components/icons/MaterialIcons';

import style from 'routes/Landing/styles';

import cx from 'classnames';

const TYPE = 'NATURE_CHANGED';

const ICON_WRAPPER_STYLE_DELETED = {
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
  transform: 'rotate(-45deg)',
  height: 24,
  width: 24,
};

const ICON_WRAPPER_STYLE = {
  color: 'rgb(255, 255, 255)',
  backgroundColor: '#5bc0de',
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
  {
    intl,
    doc,
    user,
    now: timestamp,
    metadata: { deletion = false, fromValue, toValue },
  },
  { currentUser },
) {
  return (
    <article className={cx(style.feedItem, style[TYPE])}>
      <div
        style={deletion ? ICON_WRAPPER_STYLE_DELETED : ICON_WRAPPER_STYLE}
        className={style.profilePic}
      >
        {deletion ? <TrashIcon size={18} /> : <PencilIcon size={18} />}
      </div>

      <div className={style.entry}>
        <div className={style.title}>
          <Link to={PATH_CASES_CASE + '/' + doc.id}>
            Nature de <b>{doc.refNo}</b>
          </Link>
        </div>
        {(() => {
          const hasOldValue = !!fromValue;
          const hasNewValue = !!toValue;

          const render = [];

          if (hasOldValue) {
            const changes = hasNewValue
              ? diffChars(toValue, fromValue)
              : [
                  {
                    value: fromValue,
                    removed: false,
                    added: true,
                  },
                ];
            render.push(
              <div className={style.desc}>
                <span
                  title={fromValue}
                  style={{
                    backgroundColor: '#fee8e9',
                    userSelect: 'none',
                    borderRadius: 3,
                    padding: '0 6px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: 250,
                  }}
                >
                  -{changes.map(({ value, added, removed }) => {
                    if (removed) {
                      return null;
                    }
                    const color = added ? 'rgb(255, 182, 186)' : 'transparent';
                    return (
                      <span style={{ backgroundColor: color }}>
                        {value}
                      </span>
                    );
                  })}
                </span>
              </div>,
            );
          }

          if (hasNewValue) {
            const changes = hasOldValue
              ? diffChars(fromValue, toValue)
              : [
                  {
                    value: toValue,
                    added: true,
                  },
                ];
            render.push(
              <div className={style.desc}>
                <span
                  title={toValue}
                  style={{
                    backgroundColor: '#dfd',
                    userSelect: 'none',
                    borderRadius: 3,
                    padding: '0 6px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: 250,
                  }}
                >
                  +{changes.map(({ value, removed, added }) => {
                    if (removed) {
                      return null;
                    }
                    const color = added ? '#97f295' : 'transparent';
                    return (
                      <span style={{ backgroundColor: color }}>
                        {value}
                      </span>
                    );
                  })}
                </span>
              </div>,
            );
          }

          return render;
        })()}
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
