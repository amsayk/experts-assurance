import keyOf from 'keyOf';
import moment from 'moment';

import padStart from 'lodash.padstart';

export default function printDocRef(doc) {
  const refNo = getProp(doc, 'refNo');
  const dateMission = getProp(doc, 'dateMission');

  return `${moment(dateMission).format(DATE_MISSION_FORMAT)}${padStart(refNo, PAD_LENGTH, '0')}`;
}

function getProp(obj, field, defaultValue = null) {
  const value = obj.get && obj.has && obj.has(field) ? obj.get(field) : obj[field];
  return value || defaultValue;
}

const PAD_LENGTH = 3;

const DATE_MISSION_FORMAT = 'YYMMDD';

