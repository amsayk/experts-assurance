import React from 'react'

import memoizeStringOnly from 'memoizeStringOnly';

import DocumentCreated from './type/DocumentCreated';
import DocumentDeleted from './type/DocumentDeleted';
import DocumentRestored from './type/DocumentRestored';
import DocumentManagerChanged from './type/DocumentManagerChanged';
import DocumentStateChanged from './type/DocumentStateChanged';

import FileUploaded from './type/FileUploaded';
import FileDeleted from './type/FileDeleted';
import FileRestored from './type/FileRestored';

const getComponent = memoizeStringOnly(function getComponent(type) {
  switch (type) {
    case 'DOCUMENT_CREATED'         : return DocumentCreated;
    case 'DOCUMENT_DELETED'         : return DocumentDeleted;
    case 'DOCUMENT_RESTORED'        : return DocumentRestored;
    case 'DOCUMENT_MANAGER_CHANGED' : return DocumentManagerChanged;
    case 'DOCUMENT_STATE_CHANGED'   : return DocumentStateChanged;

    case 'FILE_UPLOADED'  : return FileUploaded;
    case 'FILE_DELETED'   : return FileDeleted;
    case 'FILE_RESTORED'  : return FileRestored;
    default:
      throw new Error(`No implementation component for type: ${type}`);
  }
});

export default class TimelineEntry extends React.Component {
  render() {
    const { intl, type, document, file, user, metadata, timestamp } = this.props;
    const Component = getComponent(type);
    return (
      <Component
        intl={intl}
        doc={document}
        file={file}
        timestamp={timestamp}
        metadata={metadata}
        user={user}
      />
    )
  }
}

