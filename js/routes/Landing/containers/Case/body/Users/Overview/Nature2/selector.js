import { createSelector } from 'utils/reselect';

const props = (_, { loading, doc }) => ({
  docLoading: loading,
});

export default createSelector(props, props => ({ ...props }));
