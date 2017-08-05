import React from 'react';

import memoizeStringOnly from 'memoizeStringOnly';

import DocumentCreated from './type/DocumentCreated';
import DocumentDeleted from './type/DocumentDeleted';
import DocumentRestored from './type/DocumentRestored';
import DocumentManagerChanged from './type/DocumentManagerChanged';
import DocumentStateChanged from './type/DocumentStateChanged';

import FileUploaded from './type/FileUploaded';
import FileDeleted from './type/FileDeleted';
import FileRestored from './type/FileRestored';

import DTValidationChanged from './type/DTValidationChanged';
import MTRapportsChanged from './type/MTRapportsChanged';
import NatureChanged from './type/NatureChanged';
import PoliceChanged from './type/PoliceChanged';

import PaymentChanged from './type/PaymentChanged';

import Importation from './type/Importation';

const getComponent = memoizeStringOnly(function getComponent(type) {
  switch (type) {
    case 'DOCUMENT_CREATED':
      return DocumentCreated;
    case 'DOCUMENT_DELETED':
      return DocumentDeleted;
    case 'DOCUMENT_RESTORED':
      return DocumentRestored;
    case 'DOCUMENT_MANAGER_CHANGED':
      return DocumentManagerChanged;
    case 'DOCUMENT_STATE_CHANGED':
      return DocumentStateChanged;

    case 'FILE_UPLOADED':
      return FileUploaded;
    case 'FILE_DELETED':
      return FileDeleted;
    case 'FILE_RESTORED':
      return FileRestored;

    case 'DT_VALIDATION_CHANGED':
      return DTValidationChanged;
    case 'MT_RAPPORTS_CHANGED':
      return MTRapportsChanged;
    case 'NATURE_CHANGED':
      return NatureChanged;
    case 'POLICE_CHANGED':
      return PoliceChanged;

    case 'PAYMENT_CHANGED':
      return PaymentChanged;

    case 'IMPORTATION':
      return Importation;

    default:
      throw new Error(`No implementation component for type: ${type}`);
  }
});

export default class TimelineEntry extends React.Component {
  render() {
    const { intl, type, doc, file, user, metadata, now, timestamp } = this.props;
    const Component = getComponent(type);
    return (
      <Component
        intl={intl}
        doc={doc}
        file={file}
        timestamp={timestamp}
        now={now}
        metadata={metadata}
        user={user}
      />
    );
  }
}
