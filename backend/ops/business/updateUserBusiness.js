import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';

import { BusinessType } from 'data/types';

export default async function updateUserBusiness(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const { payload: {
    displayName,
    description,
    url,

    country,
    addressLine1,
    addressLine2,
    city,
    stateProvince,
    postalCode,

    phone,
    taxId,
  } } = request.params;

  function update(business) {
    return business
      .set({
        displayName,
        description,
        url,

        country,
        addressLine1,
        addressLine2,
        city,
        stateProvince,
        postalCode,

        phone,
        taxId,
      }).save(null, { useMasterKey: true });
  }

  let business = request.user.get('business');

  try {
    if (business) {
      business = await update(business);
    } else {
      business = await update(await getOrCreateBusiness());
    }

    await request.user.set('business', business)
      .save(null, { useMasterKey: true });

    done(null, serializeParseObject(business));
  } catch (e) {
    done(formatError(e));
  }
}

