import Parse from 'parse/node';

import uuid from 'uuid';

import moment from 'moment';

export { default as formatError } from 'error-formatter';

import config from 'build/config';

const { BusinessType, DocType } = require('data/types');

const { businessQuery } = require('data/utils');

const log = require('log')('app:backend:utils');

export async function getRefNo(dateMissionMS) {
  const value = await new Parse.Query(DocType)
    .matchesQuery('business', businessQuery())
    .greaterThanOrEqualTo('dateMission', moment(dateMissionMS).startOf('day').toDate())
    .lessThanOrEqualTo('dateMission', moment(dateMissionMS).endOf('day').toDate())
    .count({ useMasterKey : true });

  return value;
}

export function serializeParseObject(parseObject) {
  if (parseObject && !parseObject.className) {
    log(`[WARN]: Parse object doesn't have className: ${parseObject.toJSON()}`);
  }
  return parseObject ? { ...parseObject.toJSON(), className: parseObject.className } : null;
}

export function deserializeParseObject(object) {
  try {
    if (!object.className && object.emailVerified) {
      object.className = Parse.User.className;
    }
    return object ? Parse.Object.fromJSON(object) : null;
  } catch (e) {
    log.error(`Error deserializing object: ${object.toJSON ? object.toJSON() : JSON.stringify(object)}`);
    e.stack && log.error(e.stack);
    throw e;
  }
}

export async function getOrCreateBusiness() {
  const business = await businessQuery()
    .first({ useMasterKey : true });

  if (!business) {
    return await new BusinessType()
      .set('key', config.businessKey)
      .save(null, { useMasterKey: true });
  }

  return business;
}

export async function genDocKey() {
  let key;
  let exists = false;

  do {
    key = newKey();
    exists = await keyExists(key);
  } while (exists);

  return key;

  function newKey() {
    const aKey = uuid.v4();
    return aKey.split(/-/)
      .map(e => e[0])
      .join('')
      .toLowerCase();
  }

  async function keyExists(key) {
    return (await new Parse.Query(DocType)
      .equalTo('key', key)
      .count({ useMasterKey : true })) > 0;
  }
}

