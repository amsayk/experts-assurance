import Parse from 'parse/node';

export { default as formatError } from 'error-formatter';

import config from 'build/config';

import { BusinessType } from 'data/types';

export function serializeParseObject(parseObject) {
  return parseObject ? { className: parseObject.className, ...parseObject.toJSON() } : null;
}

export function deserializeParseObject(object) {
  return object ? Parse.Object.fromJSON(object) : null;
}

export async function getOrCreateBusiness() {
  const business = await new Parse.Query(BusinessType)
    .equalTo('key', config.businessKey)
    .first();

  if (!business) {
    return await new BusinessType()
      .set('key', config.businessKey)
      .save(null);
  }

  return business;
}

