import { graphql } from 'react-apollo';

import GET_USER_QUERY from './getUser.query.graphql';

const user = graphql(GET_USER_QUERY, {
  options: (ownProps) => ({
    variables: {
      id : ownProps.userId,
    },
  }),
  props: ({ ownProps, data: { loading, getUser } }) => ({
    loading,
    selectedUser : getUser,
  }),
});

export default { user };

