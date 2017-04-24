import { createSelector } from 'utils/reselect';

const props = (_, { loading, doc }) => ({
  docLoading: loading,
  id: !loading && doc.deletion ? doc.deletion.user.id : undefined,
});

export default createSelector(
  props,
  (props) => ({ ...props })
);

