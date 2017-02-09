import { formatError } from 'backend/utils';

import { ProductType } from 'data/types';

import getSlug from 'slug';

export default async function addProduct(request, response) {
  const {
    displayName,
    brandName,
    labels,
  } = request.params;

  try {
    const product = await new ProductType()
      .set({
        displayName,
        brandName,
        labels: addSlugs(labels),
      }).save(null, { useMasterKey: true });
    response.success(product);
  } catch (e) {
    response.error(formatError(e));
  }
}

function addSlugs(labels) {
  return labels.map(({ displayName, color }) => ({
    slug: getSlug(displayName),
    displayName,
    color,
  }));
}

