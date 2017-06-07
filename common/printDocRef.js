import keyOf from 'keyOf';
import moment from 'moment';

export default function printDocRef(doc) {
  const refNo = getProp(doc, 'refNo');
  const dateMission = getProp(doc, 'dateMission');

  return `${moment(dateMission).format(DATE_MISSION_FORMAT)}${refNo}`;
}

function getProp(obj, field, defaultValue = null) {
  const value = obj.get && obj.has && obj.has(field) ? obj.get(field) : obj[field];
  return value || defaultValue;
}

const DATE_MISSION_FORMAT = 'YYMMDD';

