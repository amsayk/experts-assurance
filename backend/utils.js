import Parse from 'parse/node';

import uuid from 'uuid';

export { default as formatError } from 'error-formatter';

import config from 'build/config';

const { BusinessType, DocType } = require('data/types');

const { businessQuery } = require('data/utils');

export const REF_NO_KEY = 'lastRefNo';

export async function getRefNo(business) {
  if (!business.has(REF_NO_KEY)) {
    business.set(REF_NO_KEY, 0);
  }

  business.increment(REF_NO_KEY);

  return (await business.save(null, { useMasterKey: true }))
    .get(REF_NO_KEY);
}

export function serializeParseObject(parseObject) {
  return parseObject ? { className: parseObject.className, ...parseObject.toJSON() } : null;
}

export function deserializeParseObject(object) {
  return object ? Parse.Object.fromJSON(object) : null;
}

export async function getOrCreateBusiness() {
  const business = await businessQuery()
    .first({ useMasterKey : true });

  if (!business) {
    return await new BusinessType()
      .set('key', config.businessKey)
      .set(REF_NO_KEY, 0)
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

