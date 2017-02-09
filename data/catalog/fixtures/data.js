import memoize from 'memoizeStringOnly';

import products from './_products';

const LIMIT_PER_PAGE = 30;

export const get = memoize(function get(id) {
  const index = products.findIndex((product) => product.id === id);
  return Promise.resolve(index !== -1 ? products[index] : null);
});

export function getAll({ sortConfig, label, cursor = 0 }) {
  return new Promise((resolve) => {
    const array = products.slice(cursor, cursor + LIMIT_PER_PAGE);
    resolve({
      cursor   : cursor + array.length,
      length   : products.length,
      products : array,
    });
  });
}

export function getAllLabels() {
  return new Promise((resolve) => {
    const labels = products.reduce(function (labels, product) {
      return labels.concat(product.labels);
    }, []).filter((item, pos, self) => self.findIndex(p => p.slug === item.slug) === pos);

    resolve(labels);
  });
}

export function recent(query) {
  const labels = getAllLabels().then(labels => {
    return (
      query
      ? labels.filter((l) => l.displayName.indexOf(query) !== -1)
      : labels.slice(0, 5)
    );
  });

  const ps = new Promise((resolve) => {
    const ps = query ? products.filter(function (product) {
      return product.displayName.indexOf(query) !== -1;
    }, []) : products.slice(0, 15);

    resolve(ps);
  });

  return Promise.all([labels, ps]).then(([labels, products]) => ({ labels, products }));
}


