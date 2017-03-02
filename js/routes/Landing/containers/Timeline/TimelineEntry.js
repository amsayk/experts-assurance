import React from 'react'

import memoizeStringOnly from 'memoizeStringOnly';

import DocumentCreated from './type/DocumentCreated';
import DocumentStateChanged from './type/DocumentStateChanged';

const getComponent = memoizeStringOnly(function getComponent(type) {
  switch (type) {
    case 'DOCUMENT_CREATED':
      return DocumentCreated;
    case 'DOCUMENT_STATE_CHANGED':
      return DocumentStateChanged;
    default:
      throw new Error(`No implementation component for type: ${type}`);
  }
});

export default class TimelineEntry extends React.Component {
  render() {
    const { intl, type, document, metadata, timestamp } = this.props;
    const Component = getComponent(type);
    return (
      <Component
        intl={intl}
        doc={document}
        timestamp={timestamp}
        metadata={metadata}
      />
    )
  }
}

