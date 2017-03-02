export { default as formatError } from 'error-formatter';

import { BusinessType } from 'data/types';

import config from 'build/config';

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

