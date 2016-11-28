export default function dataIdFromObject({ id, __typename }) {
    if (id && __typename) { // eslint-disable-line no-underscore-dangle
          return __typename + '-' + id; // eslint-disable-line no-underscore-dangle
        }
    return null;
};

