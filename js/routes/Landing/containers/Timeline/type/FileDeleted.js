import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import {
  PATH_CASES_CASE,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
} from 'vars';

import memoizeStringOnly from 'memoizeStringOnly';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import { FileIcon, AttachmentIcon } from 'components/icons/MaterialIcons';

const ICON_SIZE = 18;

const TYPE = 'FILE_DELETED';

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
  transform: 'rotate(-45deg)',
  height: 24,
  width: 24,
};

const ENTRY_NAME_STYLE = {
  color: '#707070',
  fontSize: 12,
  maxWidth: 150,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  marginLeft: 4,
  alignSelf: 'flex-start',
};

export default function FileDeleted({ intl, doc, file, user, timestamp, metadata }, { currentUser }) {
  return (
    <article className={cx(style.feedItem, style[TYPE])}>

      <div style={ICON_WRAPPER_STYLE} className={style.profilePic}>
        <AttachmentIcon size={22}/>
      </div>

      <div className={style.entry}>
        <div className={style.title}>
          <Link to={PATH_CASES_CASE + '/' + doc.id}>
            Suppression de pièce jointe
          </Link>
        </div>
        <div className={style.desc}>
          <div className={style.fileEntryIcon}>
            {getFileIcon(file.type)}
          </div>
          <div title={file.name} style={ENTRY_NAME_STYLE}>
            <b>{file.name}</b>
          </div>
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

FileDeleted.contextTypes = {
  currentUser : T.object.isRequired,
};

const getFileIcon = memoizeStringOnly(function getFileIcon(type) {
  if (type.startsWith('image/')) {
    return <FileIcon.Image size={ICON_SIZE} />;
  }

  if (type.startsWith('audio/')) {
    return <FileIcon.Audio size={ICON_SIZE} />;
  }

  if (type.startsWith('video/')) {
    return <FileIcon.Video size={ICON_SIZE} />;
  }

  if (type.includes('excel')) {
    return <FileIcon.Excel size={ICON_SIZE} />;
  }

  if (type.includes('word')) {
    return <FileIcon.Word size={ICON_SIZE} />;
  }

  if (type.includes('pdf')) {
    return <FileIcon.Pdf size={ICON_SIZE} />;
  }

  if (type.includes('zip')) {
    return <FileIcon.Archive size={ICON_SIZE} />;
  }

  if (type.startsWith('text/')) {
    return <FileIcon.Text size={ICON_SIZE} />;
  }

  return <FileIcon.Unknown size={ICON_SIZE} />;
});

