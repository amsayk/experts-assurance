import { createSelector } from 'utils/reselect';

const props = (_, { loading, doc }) => ({ docLoading: loading, id: !loading && doc.insurer ? doc.insurer.id : undefined });

export default createSelector(
  props,
  (props) => ({ ...props })
);

