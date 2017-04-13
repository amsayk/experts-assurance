import { createSelector } from 'utils/reselect';

const props = (_, { loading, doc }) => ({
  docLoading: loading,
  id: loading ? undefined : doc.client.id,
});

export default createSelector(
  props,
  (props) => ({ ...props })
);

