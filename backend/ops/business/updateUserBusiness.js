import { formatError } from 'backend/utils';

import { BusinessType } from 'data/types';

export default async function updateUserBusiness(request, response) {
  if (!request.user) {
    response.error(new Error('A user is required.'));
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

  function saveOrUpdate(business) {
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
      business = await saveOrUpdate(business);
    } else {
      business = await saveOrUpdate(new BusinessType());
    }

    await request.user.set('business', business)
      .save(null, { useMasterKey: true });

    response.success(business);
  } catch (e) {
    response.error(formatError(e));
  }
}

