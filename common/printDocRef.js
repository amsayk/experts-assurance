import keyOf from 'keyOf';
import moment from 'moment';

import padStart from 'lodash.padstart';

export default function printDocRef(doc, opts = { type : SHORT }) {
  const refNo = getProp(doc, 'refNo');

  if (opts.type === printDocRef.LONG) {
    const dateMission = getProp(doc, 'dateMission');
    return `${moment(dateMission).format(DATE_MISSION_FORMAT)}${padStart(refNo, PAD_LENGTH, '0')}`;
  }

  return padStart(refNo, PAD_LENGTH, '0');
}

function getProp(obj, field, defaultValue = null) {
  const value = obj.get && obj.has && obj.has(field) ? obj.get(field) : obj[field];
  return value || defaultValue;
}

const PAD_LENGTH = 3;

const DATE_MISSION_FORMAT = 'YYMMDD';

printDocRef.SHORT = keyOf({DOC_REF_NO_SHORT: null});
printDocRef.LONG  = keyOf({DOC_REF_NO_LONG: null});

