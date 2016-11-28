import memoize from 'lru-memoize';

export default memoize(10)(function (url) {
  return url;
});
