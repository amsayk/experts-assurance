import { createSelector } from 'utils/reselect';

const props = (_, { loading, doc }) => ({
  docLoading: loading,
  id: !loading && doc.validation ? doc.validation.user.id : undefined,
});

export default createSelector(
  props,
  (props) => ({ ...props })
);

