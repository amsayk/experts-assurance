import { createSelector } from 'utils/reselect';

const props = (_, { loading, doc }) => ({
  docLoading: loading,
  id: !loading && doc.agent ? doc.agent.id : undefined,
});

export default createSelector(
  props,
  (props) => ({ ...props })
);

