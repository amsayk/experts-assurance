import { createSelector } from 'utils/reselect';

const props = (_, { loading, doc }) => ({
  docLoading: loading,
  id: !loading && doc.manager ? doc.manager.id : undefined,
});

export default createSelector(
  props,
  (props) => ({ ...props })
);

