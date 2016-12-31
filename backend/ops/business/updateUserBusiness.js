import { formatError } from 'backend/utils';

import { BusinessType } from 'data/types';

const error = require('debug')('app:backend:error');

export default async function updateUserBusiness(request, response) {
  const { userId, payload: {
    displayName,
    description,

    addressLine1,
    addressLine2,
    city,
    stateProvince,
    postalCode,

    phone,
    taxId,
  } } = request.params;

  function saveOrUpdate(business) {
    if (business.isNew()) {
      business.set('user', Parse.User.createWithoutData(userId));
    }
    return business
      .set({
        displayName,
        description,

        addressLine1,
        addressLine2,
        city,
        stateProvince,
        postalCode,

        phone,
        taxId,
      }).save(null, { useMasterKey: true });
  }

  let business;

  try {
    business = await new Parse.Query(BusinessType)
      .equalTo('user', Parse.User.createWithoutData(userId))
      .first();
  } catch (e) {
    error(e);
  }

  try {
    if (business) {
      business = await saveOrUpdate(business);
    } else {
      business = await saveOrUpdate(new BusinessType());
    }

    response.success({ id: business.id, ...business.toJSON() });
  } catch (e) {
    response.error(formatError(e));
  }
}

